import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, Briefcase, ListTodo, FileText, Plus, Maximize2, Grid3X3, Tag, X, Check, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';

const App = () => {
  const [cards, setCards] = useState([]);
  const [tags, setTags] = useState([]);
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState('canvas');
  const [showNewCardMenu, setShowNewCardMenu] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [selectedCardForTags, setSelectedCardForTags] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const canvasRef = useRef(null);

  const cardTypes = [
    { type: 'note', icon: FileText, color: '#a8e6cf', label: 'Nota' },
    { type: 'idea', icon: Lightbulb, color: '#4ecdc4', label: 'Idea' },
    { type: 'task', icon: ListTodo, color: '#ffe66d', label: 'Tarea' },
    { type: 'project', icon: Briefcase, color: '#ff6b6b', label: 'Proyecto' },
  ];

  const getCardType = (type) => cardTypes.find(t => t.type === type) || cardTypes[0];

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load cards and tags
  useEffect(() => {
    if (user) {
      loadCards();
      loadTags();
    }
  }, [user]);

  const loadCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          *,
          card_tags (
            tags (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const cardsWithTags = data.map(card => ({
        ...card,
        tags: card.card_tags?.map(ct => ct.tags) || []
      }));

      setCards(cardsWithTags);
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      alert('Error al cerrar sesión: ' + error.message);
    }
  };

  const handleMouseDown = (e, card) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
    
    setDraggedCard(card);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!draggedCard || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setCards(cards.map(card => 
      card.id === draggedCard.id 
        ? { ...card, x: Math.max(0, newX), y: Math.max(0, newY) }
        : card
    ));
  };

  const handleMouseUp = async () => {
    if (draggedCard) {
      try {
        const { error } = await supabase
          .from('cards')
          .update({ 
            x: draggedCard.x, 
            y: draggedCard.y,
            updated_at: new Date().toISOString()
          })
          .eq('id', draggedCard.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating card position:', error);
      }
    }
    setDraggedCard(null);
  };

  const createNewCard = async (type) => {
    const cardType = getCardType(type);
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert([
          {
            type: type,
            title: `Nuevo ${cardType.label}`,
            content: '',
            color: cardType.color,
            x: Math.random() * 300 + 100,
            y: Math.random() * 200 + 100,
            user_id: user.id,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setCards([{ ...data, tags: [] }, ...cards]);
      setShowNewCardMenu(false);
    } catch (error) {
      console.error('Error creating card:', error);
      alert('Error al crear carta: ' + error.message);
    }
  };

  const updateCard = async (id, field, value) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));

    try {
      const { error } = await supabase
        .from('cards')
        .update({ 
          [field]: value,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const deleteCard = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta carta?')) return;

    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCards(cards.filter(card => card.id !== id));
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error al eliminar carta: ' + error.message);
    }
  };

  const toggleCardStatus = async (id, currentStatus) => {
    await updateCard(id, 'is_active', !currentStatus);
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);

    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([
          {
            name: newTagName.trim(),
            color: randomColor,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setTags([...tags, data]);
      setNewTagName('');
    } catch (error) {
      console.error('Error creating tag:', error);
      alert('Error al crear tag: ' + error.message);
    }
  };

  const toggleCardTag = async (cardId, tagId) => {
    const card = cards.find(c => c.id === cardId);
    const hasTag = card.tags.some(t => t.id === tagId);

    try {
      if (hasTag) {
        const { error } = await supabase
          .from('card_tags')
          .delete()
          .eq('card_id', cardId)
          .eq('tag_id', tagId);

        if (error) throw error;

        setCards(cards.map(c => 
          c.id === cardId 
            ? { ...c, tags: c.tags.filter(t => t.id !== tagId) }
            : c
        ));
      } else {
        const { error } = await supabase
          .from('card_tags')
          .insert([{ card_id: cardId, tag_id: tagId }]);

        if (error) throw error;

        const tag = tags.find(t => t.id === tagId);
        setCards(cards.map(c => 
          c.id === cardId 
            ? { ...c, tags: [...c.tags, tag] }
            : c
        ));
      }
    } catch (error) {
      console.error('Error toggling tag:', error);
    }
  };

  const organizedView = () => {
    const organized = {};
    cardTypes.forEach(type => {
      organized[type.type] = cards.filter(card => card.type === type.type);
    });
    return organized;
  };

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fdfbf7 0%, #f5ebe0 50%, #faf3e0 100%)',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #8b4513',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#8b4513', fontSize: '18px' }}>Cargando...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fdfbf7 0%, #f5ebe0 50%, #faf3e0 100%)',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px'
          }}>
            IdeaCanvas
          </h1>
          <p style={{ color: '#666', marginBottom: '32px', fontSize: '16px' }}>
            Tu espacio para gestionar proyectos y hacer brainstorming
          </p>
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Iniciar sesión con Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #fdfbf7 0%, #f5ebe0 50%, #faf3e0 100%)',
      fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(139, 69, 19, 0.1)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            IdeaCanvas
          </h1>
          <span style={{
            fontSize: '14px',
            color: '#666',
            background: '#f0f0f0',
            padding: '4px 12px',
            borderRadius: '8px'
          }}>
            {user.email}
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setViewMode(viewMode === 'canvas' ? 'organized' : 'canvas')}
            style={{
              padding: '10px 20px',
              background: viewMode === 'canvas' ? '#8b4513' : 'white',
              color: viewMode === 'canvas' ? 'white' : '#8b4513',
              border: '2px solid #8b4513',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
          >
            {viewMode === 'canvas' ? <Grid3x3 size={18} /> : <Maximize2 size={18} />}
            {viewMode === 'canvas' ? 'Organizar' : 'Canvas'}
          </button>
          
          <button
            onClick={() => setShowNewCardMenu(!showNewCardMenu)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
              transition: 'all 0.3s ease',
              transform: showNewCardMenu ? 'scale(0.95)' : 'scale(1)'
            }}
          >
            <Plus size={18} />
            Nueva Idea
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#8b4513',
              border: '2px solid #8b4513',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              transition: 'all 0.3s ease'
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* New Card Menu */}
      {showNewCardMenu && (
        <div style={{
          position: 'absolute',
          top: '90px',
          right: '32px',
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          zIndex: 101,
          animation: 'slideDown 0.3s ease'
        }}>
          {cardTypes.map((type, i) => {
            const Icon = type.icon;
            return (
              <button
                key={type.type}
                onClick={() => createNewCard(type.type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  width: '200px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: i < cardTypes.length - 1 ? '8px' : 0,
                  transition: 'all 0.2s ease',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = type.color + '20'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: type.color,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} color="white" />
                </div>
                <span style={{ color: '#333' }}>{type.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Tag Manager Modal */}
      {showTagManager && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
                Gestionar Tags
              </h2>
              <button
                onClick={() => {
                  setShowTagManager(false);
                  setSelectedCardForTags(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nuevo tag..."
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && createTag()}
                />
                <button
                  onClick={createTag}
                  style={{
                    padding: '10px 20px',
                    background: '#8b4513',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Crear
                </button>
              </div>
            </div>

            {selectedCardForTags && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#666' }}>
                  Tags para: {cards.find(c => c.id === selectedCardForTags)?.title}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {tags.map(tag => {
                    const card = cards.find(c => c.id === selectedCardForTags);
                    const isSelected = card?.tags.some(t => t.id === tag.id);
                    
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleCardTag(selectedCardForTags, tag.id)}
                        style={{
                          padding: '6px 12px',
                          background: isSelected ? tag.color : 'transparent',
                          color: isSelected ? 'white' : tag.color,
                          border: `2px solid ${tag.color}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {isSelected && <Check size={14} />}
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#666' }}>
                Todos los tags ({tags.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tags.map(tag => (
                  <div
                    key={tag.id}
                    style={{
                      padding: '6px 12px',
                      background: tag.color + '20',
                      color: tag.color,
                      border: `2px solid ${tag.color}`,
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canvas View */}
      {viewMode === 'canvas' && (
        <div
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            position: 'absolute',
            top: '90px',
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'auto',
            cursor: draggedCard ? 'grabbing' : 'default'
          }}
        >
          {cards.map(card => {
            const cardType = getCardType(card.type);
            const Icon = cardType.icon;
            
            return (
              <div
                key={card.id}
                onMouseDown={(e) => handleMouseDown(e, card)}
                style={{
                  position: 'absolute',
                  left: card.x,
                  top: card.y,
                  width: '280px',
                  background: 'white',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: draggedCard?.id === card.id 
                    ? '0 12px 32px rgba(0, 0, 0, 0.2)' 
                    : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  cursor: draggedCard?.id === card.id ? 'grabbing' : 'grab',
                  transition: draggedCard?.id === card.id ? 'none' : 'box-shadow 0.3s ease',
                  borderTop: `4px solid ${card.color}`,
                  transform: draggedCard?.id === card.id ? 'rotate(2deg)' : 'rotate(0deg)',
                  opacity: card.is_active ? 1 : 0.5
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: card.color + '20',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={18} color={card.color} />
                  </div>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#333',
                      outline: 'none'
                    }}
                  />
                </div>
                
                <textarea
                  value={card.content}
                  onChange={(e) => updateCard(card.id, 'content', e.target.value)}
                  placeholder="Escribe aquí..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '14px',
                    color: '#666',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: '12px'
                  }}
                />

                {card.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {card.tags.map(tag => (
                      <span
                        key={tag.id}
                        style={{
                          padding: '4px 8px',
                          background: tag.color + '20',
                          color: tag.color,
                          border: `1px solid ${tag.color}`,
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => toggleCardStatus(card.id, card.is_active)}
                    style={{
                      flex: 1,
                      padding: '6px 12px',
                      background: card.is_active ? '#4ecdc420' : '#ffe66d20',
                      color: card.is_active ? '#4ecdc4' : '#ffe66d',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {card.is_active ? 'Activo' : 'Inactivo'}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCardForTags(card.id);
                      setShowTagManager(true);
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#8b451320',
                      color: '#8b4513',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Tag size={14} />
                  </button>
                  
                  <button
                    onClick={() => deleteCard(card.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#ff6b6b20',
                      color: '#ff6b6b',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Organized View */}
      {viewMode === 'organized' && (
        <div style={{
          position: 'absolute',
          top: '90px',
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'auto',
          padding: '32px'
        }}>
          <div style={{ display: 'flex', gap: '24px', minHeight: '100%' }}>
            {cardTypes.map(cardType => {
              const Icon = cardType.icon;
              const typeCards = organizedView()[cardType.type] || [];
              
              return (
                <div key={cardType.type} style={{ flex: 1, minWidth: '300px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                    padding: '12px',
                    background: cardType.color + '20',
                    borderRadius: '12px'
                  }}>
                    <Icon size={24} color={cardType.color} />
                    <h2 style={{
                      margin: 0,
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      {cardType.label}s
                    </h2>
                    <span style={{
                      marginLeft: 'auto',
                      background: cardType.color,
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 600
                    }}>
                      {typeCards.length}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {typeCards.map(card => (
                      <div
                        key={card.id}
                        style={{
                          background: 'white',
                          borderRadius: '12px',
                          padding: '16px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                          borderLeft: `4px solid ${cardType.color}`,
                          opacity: card.is_active ? 1 : 0.5
                        }}
                      >
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                          style={{
                            width: '100%',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#333',
                            marginBottom: '8px',
                            outline: 'none'
                          }}
                        />
                        <textarea
                          value={card.content}
                          onChange={(e) => updateCard(card.id, 'content', e.target.value)}
                          placeholder="Escribe aquí..."
                          style={{
                            width: '100%',
                            minHeight: '60px',
                            border: 'none',
                            background: 'transparent',
                            fontSize: '14px',
                            color: '#666',
                            resize: 'vertical',
                            outline: 'none',
                            fontFamily: "'DM Sans', sans-serif",
                            marginBottom: '12px'
                          }}
                        />

                        {card.tags.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                            {card.tags.map(tag => (
                              <span
                                key={tag.id}
                                style={{
                                  padding: '4px 8px',
                                  background: tag.color + '20',
                                  color: tag.color,
                                  border: `1px solid ${tag.color}`,
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: 600
                                }}
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => toggleCardStatus(card.id, card.is_active)}
                            style={{
                              flex: 1,
                              padding: '4px 10px',
                              background: card.is_active ? '#4ecdc420' : '#ffe66d20',
                              color: card.is_active ? '#4ecdc4' : '#ffe66d',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600
                            }}
                          >
                            {card.is_active ? 'Activo' : 'Inactivo'}
                          </button>

                          <button
                            onClick={() => {
                              setSelectedCardForTags(card.id);
                              setShowTagManager(true);
                            }}
                            style={{
                              padding: '4px 10px',
                              background: '#8b451320',
                              color: '#8b4513',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Tag size={14} />
                          </button>

                          <button
                            onClick={() => deleteCard(card.id)}
                            style={{
                              padding: '4px 10px',
                              background: '#ff6b6b20',
                              color: '#ff6b6b',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
