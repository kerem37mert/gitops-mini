import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import styles from './Users.module.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'user'
    });
    const { token } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
            } else {
                toast.error('Kullanıcılar yüklenemedi');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Ağ hatası');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Kullanıcı başarıyla oluşturuldu');
                setShowModal(false);
                setFormData({ username: '', password: '', role: 'user' });
                fetchUsers();
            } else {
                toast.error(data.message || 'Kullanıcı oluşturulamadı');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Ağ hatası');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Kullanıcı başarıyla silindi');
                fetchUsers();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Kullanıcı silinemedi');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Ağ hatası');
        }
    };

    if (loading) {
        return <div className={styles.loading}>Kullanıcılar yükleniyor...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Kullanıcı Yönetimi</h1>
                <button className={styles.createButton} onClick={() => setShowModal(true)}>
                    + Kullanıcı Oluştur
                </button>
            </div>

            <div className={styles.userGrid}>
                {users.map(user => (
                    <div key={user.id} className={styles.userCard}>
                        <div className={styles.userInfo}>
                            <h3 className={styles.username}>{user.username}</h3>
                            <span className={`${styles.badge} ${styles[user.role]}`}>
                                {user.role === 'superuser' ? 'Süper Kullanıcı' : 'Kullanıcı'}
                            </span>
                        </div>
                        <div className={styles.userMeta}>
                            <p>Oluşturulma: {new Date(user.created_at).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div className={styles.actions}>
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteUser(user.id)}
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className={styles.modal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Yeni Kullanıcı Oluştur</h2>
                        <form onSubmit={handleCreateUser}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Kullanıcı Adı</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Parola</label>
                                <input
                                    type="password"
                                    className={styles.input}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Rol</label>
                                <select
                                    className={styles.select}
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="user">Kullanıcı</option>
                                    <option value="superuser">Süper Kullanıcı</option>
                                </select>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => setShowModal(false)}
                                >
                                    İptal
                                </button>
                                <button type="submit" className={styles.submitButton}>
                                    Kullanıcı Oluştur
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
