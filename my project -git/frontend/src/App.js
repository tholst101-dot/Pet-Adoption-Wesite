import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// 🐾 Import your local images from src/images/ here:
import dog1 from './images/dog1.jpg';
import dog2 from './images/dog2.jpg';
import dog3 from './images/dog3.jpg';
import dog4 from './images/dog4.jpg';

import cat1 from './images/cat1.jpg';
import cat2 from './images/cat2.jpg';
import cat3 from './images/cat3.jpg';
import cat4 from './images/cat4.jpg';

import rabbit1 from './images/rabbit1.jpg';
import rabbit2 from './images/rabbit2.jpg';
import rabbit3 from './images/rabbit3.jpg';
import rabbit4 from './images/rabbit4.jpg';

import snake1 from './images/snake1.jpg';
import snake2 from './images/snake2.jpg';
import snake3 from './images/snake3.jpg';
import snake4 from './images/snake4.jpg';

const ANIMAL_DATABASE = {
  Dog: {
    amount: "₹2,500",
    breeds: ["Golden Retriever", "Siberian Husky", "Pug", "Chihuahua", "German Shepherd"],
    images: [
      { name: "Golden Retriever", url: dog1},
      { name: "Siberian Husky", url: dog2 },
      { name: "Pug", url: dog3},
      { name: "German Shepherd", url: dog4 }
    ]
  },
  Cat: {
    amount: "2000",
    breeds: ["Persian Cat", "Siamese Cat", "Maine Coon", "Bengal Cat"],
    images: [
      { name: "Persian Cat", url: cat1 },
      { name: "Siamese Cat", url: cat2 },
      { name: "Tabby Sweet", url: cat3 },
      { name: "Cute Kitten", url: cat4 }
    ]
  },
  Rabbit: {
    amount: "1500",
    breeds: ["Angora Rabbit", "Dutch Rabbit", "Lionhead Rabbit", "Flemish Giant"],
    images: [
      { name: "White Fluffy Rabbit", url: rabbit1 },
      { name: "Brown Bunny", url: rabbit2 },
      { name: "Domestic Rabbit", url: rabbit3 },
      { name: "Little Hare", url: rabbit4 }
    ]
  },
  Snake: {
    amount: "₹8,500",
    breeds: ["Ball Python", "Corn Snake", "Milk Snake", "Garter Snake"],
    images: [
      { name: "Ball Python", url: snake1 },
      { name: "Green Snake", url: snake2 },
      { name: "Corn Snake", url: snake3 },
      { name: "Coiled Python", url: snake4 }
    ]
  }
};

function App() {
  const [activeTab, setActiveTab] = useState('storefront');
  const [selectedCategory, setSelectedCategory] = useState('Dog'); 
  
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminDatabaseRecords, setAdminDatabaseRecords] = useState([]);
  
  const [lastSubmissionSummary, setLastSubmissionSummary] = useState(null);

  const [formData, setFormData] = useState({
    applicantName: '',
    phone: '',
    contactEmail: '',
    age: '',
    gender: 'Male',
    breedSelected: ''
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      breedSelected: ANIMAL_DATABASE[selectedCategory].breeds[0]
    }));
  }, [selectedCategory]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const executeFormSubmit = async (e) => {
    e.preventDefault();

    const currentFee = ANIMAL_DATABASE[selectedCategory].amount;
    const finalPayload = {
      ...formData,
      animalCategory: selectedCategory,
      amountCharged: currentFee
    };

    try {
      await axios.post('http://localhost:5000/api/adopt', finalPayload);
      setLastSubmissionSummary(finalPayload);
      setActiveTab('success_view');
    } catch (err) {
      console.error("Error submitting form data:", err);
      setLastSubmissionSummary(finalPayload);
      setActiveTab('success_view');
    }
  };

  const fetchAdminRecords = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/records');
      setAdminDatabaseRecords(res.data);
    } catch (err) {
      console.error("Failed fetching collection entries:", err);
    }
  };

  const handleAdminAuthentication = async (e) => {
    e.preventDefault();
    if (adminUser === "master" && adminPass === "blaster") {
      await fetchAdminRecords();
      setActiveTab('admin_dashboard');
    } else {
      alert("⚠️ ACCESS LOCKED: Invalid master/blaster authority credentials!");
    }
  };

  // Function linked to handling resource deletes dynamically
  const executeRecordPurge = async (recordId) => {
    if (window.confirm("Are you sure you want to permanently delete this registration record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/records/${recordId}`);
        // Refresh local state tracking arrays seamlessly
        fetchAdminRecords();
      } catch (err) {
        console.error("Error purging record target:", err);
        alert("Failed to delete the database entry.");
      }
    }
  };

  const logOutAdmin = () => {
    setAdminUser('');
    setAdminPass('');
    setActiveTab('storefront');
  };

  return (
    <div className="system-shell">
      <nav className="navbar-grid-system">
        <h2 onClick={() => setActiveTab('storefront')} className="nav-logo-anchor">🐾 Canine & Exotic Haven</h2>
        
        <div className="nav-categories-row">
          {Object.keys(ANIMAL_DATABASE).map(cat => (
            <button 
              key={cat} 
              onClick={() => { setSelectedCategory(cat); setActiveTab('storefront'); }} 
              className={selectedCategory === cat && activeTab === 'storefront' ? "cat-tab active" : "cat-tab"}
            >
              {cat}s
            </button>
          ))}
        </div>

        <button onClick={() => setActiveTab('admin_login')} className="admin-gate-btn">🔒 Admin Control</button>
      </nav>

      {/* VIEW MODULE 1: STOREFRONT */}
      {activeTab === 'storefront' && (
        <section className="storefront-showcase animate-render">
          <div className="category-billboard-header">
            <h2>Active Profiles For: <span className="highlight-tag">{selectedCategory}s</span></h2>
            <p>Adoption Status for this catalog: <strong>{ANIMAL_DATABASE[selectedCategory].amount}</strong></p>
          </div>

          <div className="dynamic-photo-matrix">
            {ANIMAL_DATABASE[selectedCategory].images.map((img, index) => (
              <div key={index} className="photo-card-node">
                <img src={img.url} alt={img.name} />
                <div className="card-label-overlay">
                  <h4>{img.name}</h4>
                  <p>Category: {selectedCategory}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="call-to-action-panel">
            <button onClick={() => setActiveTab('form')} className="trigger-form-btn">
              Proceed to Adoption Form for {selectedCategory}s ➔
            </button>
          </div>
        </section>
      )}

      {/* VIEW MODULE 2: REGISTRATION FORM */}
      {activeTab === 'form' && (
        <section className="form-workspace-panel animate-render">
          <div className="bounded-form-card">
            <button onClick={() => setActiveTab('storefront')} className="back-link-btn">← Back to {selectedCategory} Catalog</button>
            <h3>Adoption Registration Form ({selectedCategory})</h3>

            <form onSubmit={executeFormSubmit}>
              <label>Applicant Full Name *</label>
              <input type="text" name="applicantName" required value={formData.applicantName} onChange={handleInputChange} placeholder="e.g., Sachin" />

              <label>Contact Phone Number *</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="e.g., 9876543210" />

              <label>Email ID *</label>
              <input type="email" name="contactEmail" required value={formData.contactEmail} onChange={handleInputChange} placeholder="e.g., adopter@example.com" />

              <div className="split-form-row">
                <div>
                  <label>{selectedCategory} Breed Selection *</label>
                  <select name="breedSelected" value={formData.breedSelected} onChange={handleInputChange}>
                    {ANIMAL_DATABASE[selectedCategory].breeds.map((breed, i) => (
                      <option key={i} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Age Constraint *</label>
                  <input type="text" name="age" required value={formData.age} onChange={handleInputChange} placeholder="e.g., 1 Year" />
                </div>
              </div>

              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <button type="submit" className="final-commit-btn">Complete Adoption Securely</button>
            </form>
          </div>
        </section>
      )}

      {/* VIEW MODULE 3: USER ADOPTION CONFIRMATION SCREEN */}
      {activeTab === 'success_view' && lastSubmissionSummary && (
        <section className="success-panel-workspace animate-render">
          <div className="success-notification-billboard">
            <div className="success-checkmark-badge">✓</div>
            <h2>You are Successfully Registered!</h2>
            <p className="subtext" style={{ fontSize: '1.1rem', color: '#475569', fontWeight: '500' }}>
              Our dedicated management team will contact you in a few days to coordinate schedules.
            </p>
            
            <div className="invoice-receipt-card">
              <h4>Adoption Manifest Record</h4>
              <p><strong>Adopter Name:</strong> {lastSubmissionSummary.applicantName}</p>
              <p><strong>Selected Animal:</strong> {lastSubmissionSummary.breedSelected} ({lastSubmissionSummary.animalCategory})</p>
              <p><strong>Adoption Price:</strong> <span className="price-tag">{lastSubmissionSummary.amountCharged}</span></p>
            </div>

            <button onClick={() => { setActiveTab('storefront'); setFormData({ applicantName: '', phone: '', contactEmail: '', age: '', gender: 'Male', breedSelected: '' }); }} className="return-storefront-btn">
              Return to Catalog Home
            </button>
          </div>
        </section>
      )}

      {/* VIEW MODULE 4: ADMIN GATEKEEPER */}
      {activeTab === 'admin_login' && (
        <section className="form-workspace-panel animate-render">
          <div className="bounded-form-card admin-lock-card">
            <h3>Admin System Lock Gateway</h3>
            <form onSubmit={handleAdminAuthentication}>
              <label>Admin Username ID</label>
              <input type="text" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} placeholder="Enter user..." required />

              <label>Admin Access Password</label>
              <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="Enter code..." required />

              <button type="submit" className="admin-login-trigger-btn">Authenticate & Query Database</button>
            </form>
          </div>
        </section>
      )}

      {/* VIEW MODULE 5: RESTRICTED ADMIN SYSTEM MONITOR */}
      {activeTab === 'admin_dashboard' && (
        <section className="admin-dashboard-container animate-render">
          <div className="admin-dashboard-header">
            <h3>🛡️ Restricted System Administration Console</h3>
            <button onClick={logOutAdmin} className="admin-logout-btn">Log Out Session</button>
          </div>

          <div className="table-responsive-wrapper">
            {adminDatabaseRecords.length === 0 ? (
              <p className="no-records-lbl" style={{ padding: '20px', textAlign: 'center' }}>No active adoption registrations found.</p>
            ) : (
              <table className="admin-data-grid">
                <thead>
                  <tr>
                    <th>Date Registered</th>
                    <th>Applicant Name</th>
                    <th>Phone</th>
                    <th>Email Target Address</th>
                    <th>Animal Type</th>
                    <th>Selected Breed</th>
                    <th>Price Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminDatabaseRecords.map((rec) => (
                    <tr key={rec._id}>
                      <td>{new Date(rec.registeredAt).toLocaleDateString()}</td>
                      <td><strong>{rec.applicantName}</strong></td>
                      <td>{rec.phone}</td>
                      <td>{rec.contactEmail}</td>
                      <td><span className="table-cat-badge">{rec.animalCategory}</span></td>
                      <td>{rec.breedSelected}</td>
                      <td><span className="table-price-badge">{rec.amountCharged}</span></td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => executeRecordPurge(rec._id)} 
                          className="table-delete-btn"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default App;