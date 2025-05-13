import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dishes } from '../../data/dishes.js';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dishes');
  const navigate = useNavigate();
  const [dishList, setDishList] = useState(dishes);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [users] = useState([
    { id: 1, email: 'user1@example.com', role: 'client', lastLogin: '2024-02-20' },
    { id: 2, email: 'user2@example.com', role: 'client', lastLogin: '2024-02-19' }
  ]);

  const [orders, setOrders] = useState([
    { 
      id: 1, 
      user: 'user1@example.com', 
      items: [
        { name: 'Yassa poulet', quantity: 2, price: 14.90 },
        { name: 'Thiep poisson', quantity: 1, price: 15.90 }
      ],
      total: 45.70,
      status: 'en attente',
      date: '2024-02-20'
    },
    { 
      id: 2, 
      user: 'user2@example.com', 
      items: [
        { name: 'Pastels au thon', quantity: 3, price: 6.90 }
      ],
      total: 20.70,
      status: 'livré',
      date: '2024-02-19'
    }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleDeleteDish = (id) => {
    setDishList(dishList.filter(dish => dish.id !== id));
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrder = (updatedOrder) => {
    setOrders(orders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
    setShowOrderModal(false);
  };

  const OrderDetailsModal = ({ order, onClose, onUpdate }) => {
    const [editedOrder, setEditedOrder] = useState(order);

    const handleQuantityChange = (itemIndex, newQuantity) => {
      const updatedItems = [...editedOrder.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: parseInt(newQuantity)
      };
      
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
      setEditedOrder({
        ...editedOrder,
        items: updatedItems,
        total: newTotal
      });
    };

    const handleSave = () => {
      onUpdate(editedOrder);
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Détails de la commande #{order.id}</h2>
          <div className="modal-body">
            <p><strong>Client:</strong> {order.user}</p>
            <p><strong>Date:</strong> {order.date}</p>
            
            <h3>Articles</h3>
            <table className="modal-items-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Quantité</th>
                  <th>Prix unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {editedOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                      />
                    </td>
                    <td>{item.price.toFixed(2)}€</td>
                    <td>{(item.quantity * item.price).toFixed(2)}€</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <p className="modal-total">
              <strong>Total:</strong> {editedOrder.total.toFixed(2)}€
            </p>

            <div className="modal-status">
              <label>
                <strong>Statut:</strong>
                <select
                  value={editedOrder.status}
                  onChange={(e) => setEditedOrder({...editedOrder, status: e.target.value})}
                >
                  <option value="en attente">En attente</option>
                  <option value="en préparation">En préparation</option>
                  <option value="en livraison">En livraison</option>
                  <option value="livré">Livré</option>
                  <option value="annulé">Annulé</option>
                </select>
              </label>
            </div>
          </div>
          
          <div className="modal-actions">
            <button onClick={handleSave} className="save-button">
              Enregistrer les modifications
            </button>
            <button onClick={onClose} className="cancel-button">
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDishesManagement = () => (
    <div className="dishes-management">
      <div className="section-header">
        <h2>Gestion des plats</h2>
        <button className="add-button">Ajouter un plat</button>
      </div>
      
      <div className="dishes-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Prix</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dishList.map(dish => (
              <tr key={dish.id}>
                <td>
                  <img 
                    src={dish.image} 
                    alt={dish.name} 
                    className="dish-thumbnail"
                  />
                </td>
                <td>{dish.name}</td>
                <td>{dish.price}€</td>
                <td>{dish.category}</td>
                <td className="action-buttons">
                  <button className="edit-button">Modifier</button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteDish(dish.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsersManagement = () => (
    <div className="users-management">
      <div className="section-header">
        <h2>Gestion des utilisateurs</h2>
      </div>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Dernière connexion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.lastLogin}</td>
                <td className="action-buttons">
                  <button className="edit-button">Modifier</button>
                  <button className="delete-button">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrdersManagement = () => (
    <div className="orders-management">
      <div className="section-header">
        <h2>Gestion des commandes</h2>
      </div>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Articles</th>
              <th>Total</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user}</td>
                <td>
                  <ul className="order-items-list">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{order.total}€</td>
                <td>{order.date}</td>
                <td>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`status-select status-${order.status.replace(' ', '-')}`}
                  >
                    <option value="en attente">En attente</option>
                    <option value="en préparation">En préparation</option>
                    <option value="en livraison">En livraison</option>
                    <option value="livré">Livré</option>
                    <option value="annulé">Annulé</option>
                  </select>
                </td>
                <td className="action-buttons">
                  <button 
                    className="edit-button"
                    onClick={() => handleOrderClick(order)}
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Tableau de bord administrateur</h1>
        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`tab-button ${activeTab === 'dishes' ? 'active' : ''}`}
          onClick={() => setActiveTab('dishes')}
        >
          Gestion des plats
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Commandes
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'dishes' && renderDishesManagement()}
        {activeTab === 'orders' && renderOrdersManagement()}
        {activeTab === 'users' && renderUsersManagement()}
      </main>

      {showOrderModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onUpdate={handleUpdateOrder}
        />
      )}
    </div>
  );
}

export default AdminDashboard;