import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket']
});

export default function Chat() {
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [toUser, setToUser] = useState('');
  const [message, setMessage] = useState('');
  const [messageInputs, setMessageInputs] = useState({});
  const [chatBoxes, setChatBoxes] = useState({});


  const openChatWith = (user) => {
    if (!chatBoxes[user]) {
      socket.emit('get history', { withUser: user }, (history) => {
        setChatBoxes(prev => ({
          ...prev,
          [user]: history.map(h => ({ from: h.from, message: h.message }))
        }));
      });
    }
  };

  useEffect(() => {
    socket.on('private message', ({ from, message }) => {
      setChatBoxes(prev => ({
        ...prev,
        [from]: [
          ...(prev[from] || []),
          { from, message }
        ]
      }));
    });

    socket.on('error', (err) => {
      alert(err);
    });

    return () => {
      socket.off('private message');
      socket.off('error');
    };
  }, []);


  const handleSetUsername = () => {
    if (username.trim()) {
      socket.emit('set username', username.trim());
      setIsUsernameSet(true);
    }
  };

  const sendMessage = (toUser) => {
    openChatWith(toUser);

    const msg = messageInputs[toUser] || message;
    if (!msg || !msg.trim()) return;

    socket.emit('private message', { to: toUser, message: msg });

    setChatBoxes((prev) => ({
      ...prev,
      [toUser]: [...(prev[toUser] || []), { from: 'Siz', message: msg }]
    }));

    if (messageInputs[toUser]) {
      setMessageInputs((prev) => ({
        ...prev,
        [toUser]: ''
      }));
    } else {
      setMessage('');
    }
  };


  return (
    <div style={{ paddingTop: '120px' }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'white',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        {isUsernameSet ? (
          <strong style={{ fontSize: '18px' }}>Kullanıcı Adınız: {username}</strong>
        ) : (
          <>
            <h1>Kullanıcı Adı Girin</h1>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınız"
            />
            <button onClick={handleSetUsername}>Kaydet</button>
          </>
        )}
      </div>

      {isUsernameSet && (
        <div style={{ padding: '2rem', width: '95vw', overflow: 'hidden' }}>
          <h2>Özel Mesajlaşma</h2>
          <div style={{ display: 'flex', flexDirection: 'column', width: '340px' }}>
            <input
              type="text"
              placeholder="Mesaj göndermek istediğiniz kullanıcı"
              value={toUser}
              onChange={(e) => setToUser(e.target.value)}
            />
            <input
              type="text"
              placeholder="Mesajınızı yazın"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={() => sendMessage(toUser)}>Gönder</button>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Mesajlar</h3>
            {Object.keys(chatBoxes).map((user, index) => (
              <div key={index} style={{
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                marginBottom: '20px',
                padding: '10px'
              }}>
                <h4>{user}</h4>
                <ul>
                  {chatBoxes[user].map((msg, i) => (
                    <li key={i}><strong>{msg.from}:</strong> {msg.message}</li>
                  ))}
                </ul>
                <div style={{ display: 'flex' }}>
                  <input
                    type="text"
                    value={messageInputs[user] || ''}
                    onChange={(e) =>
                      setMessageInputs((prev) => ({
                        ...prev,
                        [user]: e.target.value
                      }))
                    }
                    placeholder="Mesaj yaz..."
                    style={{ flex: 1 }}
                  />
                  <button style={{margin: 'auto auto auto 30px'}} onClick={() => sendMessage(user)}>Gönder</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
