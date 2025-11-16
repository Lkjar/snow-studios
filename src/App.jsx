import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, CheckCircle, X, Package, Bell, BellOff, ExternalLink, Upload, AlertCircle, Clock } from 'lucide-react';

export default function SnowStudios() {
  const [showModal, setShowModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [requests, setRequests] = useState([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDiscord, setUserDiscord] = useState('');
  const [paymentProof, setPaymentProof] = useState('');
  
  const [formData, setFormData] = useState({
    discord: '',
    roblox: '',
    description: ''
  });

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      setTimeout(() => {
        if (Notification.permission === 'default') {
          requestNotificationPermission();
        }
      }, 2000);
    }
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
      console.log('Erro ao solicitar permissão');
    }
  };

  const sendNotification = (title, body) => {
    if (notificationPermission === 'granted') {
      new Notification(title, { body });
    }
  };

  const handleSubmit = () => {
    if (!formData.discord || !formData.roblox || !formData.description) {
      alert('Por favor, preencha todos os campos!');
      return;
    }
    
    const newRequest = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      timestamp: new Date().toLocaleString('pt-BR')
    };
    setRequests([...requests, newRequest]);
    setUserDiscord(formData.discord);
    setFormData({ discord: '', roblox: '', description: '' });
    setShowModal(false);
    setShowSuccessMessage(true);
  };

  const handleAdminResponse = (requestId, price, deadline, gamepassLink) => {
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'responded', price, deadline, gamepassLink };
      }
      return req;
    });
    setRequests(updatedRequests);
    sendNotification('Snow Studios', 'O administrador respondeu sua solicitação!');
    alert('Resposta enviada ao cliente!');
  };

  const handleMarkAsReady = (requestId) => {
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'ready_for_payment' };
      }
      return req;
    });
    setRequests(updatedRequests);
    sendNotification('Snow Studios - Pedido Pronto!', 'Seu pedido está pronto! Realize o pagamento.');
    alert('Cliente notificado que o pedido está pronto!');
  };

  const handleSubmitPaymentProof = () => {
    if (!paymentProof.trim()) {
      alert('Por favor, cole o link da imagem do comprovante!');
      return;
    }
    
    const updatedRequests = requests.map(req => {
      if (req.id === selectedOrderForPayment) {
        return { ...req, status: 'awaiting_approval', paymentProof };
      }
      return req;
    });
    setRequests(updatedRequests);
    setPaymentProof('');
    setShowPaymentModal(false);
    setSelectedOrderForPayment(null);
    alert('Comprovante enviado! Aguarde a aprovação.');
  };

  const handleApprovePayment = (requestId, scriptLink) => {
    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'completed', scriptLink };
      }
      return req;
    });
    setRequests(updatedRequests);
    sendNotification('Snow Studios - Pagamento Aprovado!', 'Seu pagamento foi aprovado!');
    alert('Pagamento aprovado e script liberado!');
  };

  const handleAdminLogin = () => {
    if (adminPassword === '829471') {
      setIsAdmin(true);
    } else {
      alert('Senha incorreta!');
    }
  };

  const getMyOrders = () => {
    return requests.filter(req => req.discord === userDiscord);
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Aguardando Resposta',
      responded: 'Orçamento Enviado',
      ready_for_payment: 'Aguardando Pagamento',
      awaiting_approval: 'Aguardando Aprovação',
      completed: 'Concluído'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      responded: 'bg-blue-500/20 text-blue-400',
      ready_for_payment: 'bg-orange-500/20 text-orange-400',
      awaiting_approval: 'bg-purple-500/20 text-purple-400',
      completed: 'bg-green-500/20 text-green-400'
    };
    return colorMap[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        <header className="p-4 md:p-6 flex flex-wrap justify-between items-center backdrop-blur-sm bg-black/30 gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center transform rotate-45">
              <span className="text-xl md:text-2xl font-bold transform -rotate-45">❄️</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Snow Studios
            </h1>
          </div>
          <div className="flex gap-2 md:gap-3">
            {userDiscord && (
              <button
                onClick={() => setShowMyOrders(true)}
                className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:scale-105 transition-transform flex items-center gap-1 md:gap-2 text-sm md:text-base"
              >
                <Package className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Meus Pedidos</span>
                <span className="sm:hidden">Pedidos</span>
              </button>
            )}
            <button
              onClick={() => {
                setShowAdminPanel(true);
                if (!isAdmin) setAdminPassword('');
              }}
              className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:scale-105 transition-transform text-sm md:text-base"
            >
              Admin
            </button>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="text-center space-y-6 md:space-y-8 max-w-4xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 animate-pulse">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Scripts Premium
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 md:mb-8 px-4">
              Desenvolvimento de sistemas e scripts profissionais para Roblox
            </p>
            
            <button
              onClick={() => setShowModal(true)}
              className="group relative px-8 py-4 md:px-12 md:py-6 text-xl md:text-2xl font-bold rounded-2xl overflow-hidden transform hover:scale-105 md:hover:scale-110 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.5)'
              }}
            >
              <span className="relative z-10 flex items-center gap-2 md:gap-3">
                <MessageSquare className="w-6 h-6 md:w-8 md:h-8" />
                <span className="whitespace-nowrap">CONTRATAR AGORA</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16 px-4">
              {[
                { icon: '⚡', title: 'Rápido', desc: 'Entrega ágil' },
                { icon: '🎯', title: 'Preciso', desc: 'Qualidade garantida' },
                { icon: '💎', title: 'Premium', desc: 'Scripts exclusivos' }
              ].map((item, i) => (
                <div key={i} className="p-4 md:p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all hover:scale-105">
                  <div className="text-3xl md:text-4xl mb-2 md:mb-3">{item.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold">Solicitar Serviço</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Nome no Discord</label>
                <input
                  type="text"
                  value={formData.discord}
                  onChange={(e) => setFormData({...formData, discord: e.target.value})}
                  className="w-full px-3 py-2 md:px-4 md:py-3 bg-black/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none text-sm md:text-base"
                  placeholder="usuario#1234"
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Nome no Roblox</label>
                <input
                  type="text"
                  value={formData.roblox}
                  onChange={(e) => setFormData({...formData, roblox: e.target.value})}
                  className="w-full px-3 py-2 md:px-4 md:py-3 bg-black/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none text-sm md:text-base"
                  placeholder="SeuNomeRoblox"
                />
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Descrição do Script/Sistema</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 md:px-4 md:py-3 bg-black/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none h-24 md:h-32 resize-none text-sm md:text-base"
                  placeholder="Descreva detalhadamente o que você precisa..."
                />
              </div>
              
              <button
                onClick={handleSubmit}
                className="w-full py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
                Enviar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessMessage && (
        <SuccessModal 
          notificationPermission={notificationPermission}
          requestNotificationPermission={requestNotificationPermission}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          paymentProof={paymentProof}
          setPaymentProof={setPaymentProof}
          onSubmit={handleSubmitPaymentProof}
          onClose={() => {
            setShowPaymentModal(false);
            setPaymentProof('');
          }}
        />
      )}

      {showMyOrders && (
        <MyOrdersModal
          orders={getMyOrders()}
          getStatusText={getStatusText}
          getStatusColor={getStatusColor}
          onClose={() => setShowMyOrders(false)}
          onPayment={(orderId) => {
            setSelectedOrderForPayment(orderId);
            setShowPaymentModal(true);
          }}
        />
      )}

      {showAdminPanel && (
        <AdminPanel
          isAdmin={isAdmin}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          handleAdminLogin={handleAdminLogin}
          requests={requests}
          onClose={() => {
            setShowAdminPanel(false);
            setIsAdmin(false);
          }}
          onRespond={handleAdminResponse}
          onMarkReady={handleMarkAsReady}
          onApprovePayment={handleApprovePayment}
        />
      )}
    </div>
  );
}

function SuccessModal({ notificationPermission, requestNotificationPermission, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-green-900/50 to-black border border-green-500/30 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-green-400">Pedido Enviado!</h3>
          <p className="text-gray-300">Seu pedido foi recebido com sucesso! Em breve será respondido.</p>
          
          {notificationPermission !== 'granted' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BellOff className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <p className="font-semibold text-yellow-400 mb-1">Ative as notificações!</p>
                  <p className="text-sm text-gray-300">Habilite para ser notificado quando respondermos.</p>
                  <button
                    onClick={requestNotificationPermission}
                    className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-semibold"
                  >
                    Habilitar Notificações
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {notificationPermission === 'granted' && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 justify-center">
                <Bell className="w-5 h-5 text-green-400" />
                <p className="text-sm text-green-400 font-semibold">Você receberá uma notificação!</p>
              </div>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold hover:scale-105 transition-transform"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ paymentProof, setPaymentProof, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Enviar Comprovante</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-orange-400 mb-2">IMPORTANTE</p>
              <p className="text-sm text-gray-300">O comprovante PRECISA conter:</p>
              <ul className="text-sm text-gray-300 mt-2 space-y-1 list-disc list-inside">
                <li>Data e hora do pagamento</li>
                <li>Valor pago visível</li>
                <li>Print completo da tela</li>
              </ul>
              <p className="text-xs text-gray-400 mt-3">
                Faça upload em imgur.com e cole o link aqui.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Link da Imagem do Comprovante</label>
            <input
              type="text"
              value={paymentProof}
              onChange={(e) => setPaymentProof(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-orange-500/30 rounded-lg focus:border-orange-500 focus:outline-none"
              placeholder="https://i.imgur.com/exemplo.png"
            />
          </div>
          
          <button
            onClick={onSubmit}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Enviar Comprovante
          </button>
        </div>
      </div>
    </div>
  );
}

function MyOrdersModal({ orders, getStatusText, getStatusColor, onClose, onPayment }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl p-8 max-w-4xl w-full shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-7 h-7" />
            Meus Pedidos
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Você ainda não fez nenhum pedido</p>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                getStatusText={getStatusText}
                getStatusColor={getStatusColor}
                onPayment={() => onPayment(order.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, getStatusText, getStatusColor, onPayment }) {
  return (
    <div className="bg-black/30 border border-purple-500/20 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-400">{order.timestamp}</p>
          <p className="text-gray-300 mt-1">Roblox: {order.roblox}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>
      
      <div className="bg-black/30 rounded-lg p-4 mb-4">
        <p className="text-sm font-semibold mb-2">Sua Solicitação:</p>
        <p className="text-gray-300">{order.description}</p>
      </div>

      {order.status === 'responded' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="font-semibold text-blue-400 mb-2">Orçamento Enviado</p>
          <p className="text-sm">Preço: <span className="font-bold text-lg">{order.price} Robux</span></p>
          <p className="text-sm">Prazo: <span className="font-bold">{order.deadline}</span></p>
          {order.gamepassLink && (
            <div className="mt-3">
              <a
                href={order.gamepassLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                Acessar Gamepass
              </a>
            </div>
          )}
        </div>
      )}

      {order.status === 'ready_for_payment' && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-orange-400" />
            <span className="font-semibold text-orange-400">Pedido Pronto!</span>
          </div>
          <p className="text-sm mb-3">Realize o pagamento para receber o script.</p>
          <div className="space-y-2 mb-4">
            <p className="text-sm">Valor: <span className="font-bold text-lg">{order.price} Robux</span></p>
            {order.gamepassLink && (
              <a
                href={order.gamepassLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                Comprar Gamepass
              </a>
            )}
          </div>
          <button
            onClick={onPayment}
            className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Enviar Comprovante
          </button>
        </div>
      )}

      {order.status === 'awaiting_approval' && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-purple-400">Aguardando Aprovação</span>
          </div>
          <p className="text-sm mb-3">Seu comprovante está sendo analisado.</p>
          {order.paymentProof && (
            <a href={order.paymentProof} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:underline break-all">
              Ver comprovante
            </a>
          )}
        </div>
      )}

      {order.status === 'completed' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-green-400">Pagamento Aprovado!</span>
          </div>
          <p className="text-sm mb-3">Seu script está pronto!</p>
          {order.scriptLink && (
            <a
              href={order.scriptLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              Baixar Script
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function AdminPanel({ isAdmin, adminPassword, setAdminPassword, handleAdminLogin, requests, onClose, onRespond, onMarkReady, onApprovePayment }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-2xl p-8 max-w-4xl w-full shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Painel Admin</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isAdmin ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Digite a senha"
              />
            </div>
            <button
              onClick={handleAdminLogin}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              Entrar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Nenhuma solicitação</p>
            ) : (
              requests.map((req) => (
                <AdminRequestCard
                  key={req.id}
                  request={req}
                  onRespond={onRespond}
                  onMarkReady={onMarkReady}
                  onApprovePayment={onApprovePayment}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminRequestCard({ request, onRespond, onMarkReady, onApprovePayment }) {
  const [showForm, setShowForm] = useState(false);
  const [price, setPrice] = useState('');
  const [deadline, setDeadline] = useState('');
  const [gamepassLink, setGamepassLink] = useState('');
  const [scriptLink, setScriptLink] = useState('');

  const handleSubmitResponse = () => {
    if (!price || !deadline) {
      alert('Preencha preço e prazo!');
      return;
    }
    onRespond(request.id, price, deadline, gamepassLink);
    setShowForm(false);
  };

  const handleApprove = () => {
    if (!scriptLink) {
      alert('Insira o link do script!');
      return;
    }
    onApprovePayment(request.id, scriptLink);
  };

  return (
    <div className="bg-black/30 border border-purple-500/20 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-400">{request.timestamp}</p>
          <p className="font-semibold mt-1">Discord: {request.discord}</p>
          <p className="text-gray-300">Roblox: {request.roblox}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
          request.status === 'responded' ? 'bg-blue-500/20 text-blue-400' :
          request.status === 'ready_for_payment' ? 'bg-orange-500/20 text-orange-400' :
          request.status === 'awaiting_approval' ? 'bg-purple-500/20 text-purple-400' :
          'bg-green-500/20 text-green-400'
        }`}>
          {request.status === 'pending' ? 'Pendente' :
           request.status === 'responded' ? 'Respondido' :
           request.status === 'ready_for_payment' ? 'Aguardando Pagamento' :
           request.status === 'awaiting_approval' ? 'Aguardando Aprovação' :
           'Concluído'}
        </span>
      </div>
      
      <div className="bg-black/30 rounded-lg p-4 mb-4">
        <p className="text-sm font-semibold mb-2">Descrição:</p>
        <p className="text-gray-300">{request.description}</p>
      </div>

      {request.status === 'pending' && (
        <>
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:scale-105 transition-transform"
            >
              Responder
            </button>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Preço (Robux)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Prazo</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                    placeholder="3 dias"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Link da Gamepass (opcional)</label>
                <input
                  type="text"
                  value={gamepassLink}
                  onChange={(e) => setGamepassLink(e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                  placeholder="https://www.roblox.com/game-pass/..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSubmitResponse}
                  className="flex-1 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                >
                  Enviar Resposta
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {request.status === 'responded' && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="font-semibold text-blue-400 mb-2">Orçamento Enviado</p>
          <p className="text-sm">Preço: {request.price} Robux</p>
          <p className="text-sm">Prazo: {request.deadline}</p>
          <button
            onClick={() => onMarkReady(request.id)}
            className="mt-3 w-full py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg hover:scale-105 transition-transform text-sm font-semibold"
          >
            Marcar como Pronto (Notificar Cliente)
          </button>
        </div>
      )}

      {request.status === 'ready_for_payment' && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
          <p className="font-semibold text-orange-400 mb-2">Aguardando Pagamento do Cliente</p>
          <p className="text-sm text-gray-300">Cliente foi notificado para realizar o pagamento.</p>
        </div>
      )}

      {request.status === 'awaiting_approval' && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <p className="font-semibold text-purple-400 mb-3">Comprovante Recebido</p>
          {request.paymentProof && (
            <div className="mb-4">
              <a
                href={request.paymentProof}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                Ver Comprovante
              </a>
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1">Link do Script</label>
              <input
                type="text"
                value={scriptLink}
                onChange={(e) => setScriptLink(e.target.value)}
                className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none text-sm"
                placeholder="https://pastebin.com/..."
              />
            </div>
            <button
              onClick={handleApprove}
              className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:scale-105 transition-transform text-sm font-semibold"
            >
              Aprovar Pagamento e Liberar Script
            </button>
          </div>
        </div>
      )}

      {request.status === 'completed' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-green-400">Pedido Concluído</span>
          </div>
          <p className="text-sm">Script liberado para o cliente!</p>
        </div>
      )}
    </div>
  );
}