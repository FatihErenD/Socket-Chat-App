# Socket Chat App

Basit bir gerçek zamanlı mesajlaşma uygulaması.  
Kullanıcılar kendi kullanıcı adlarını belirleyerek özel sohbetler yapabilir, mesaj geçmişi otomatik olarak yüklenir. Docker & Redis ile tam containerize edilmiştir.

---

## ⚙️ Özellikler

- **Kullanıcı adı ile kimlik doğrulama**  
- **Özel (1-e-1) sohbet**  
  - İlk mesajdan önce geçmiş otomatik yüklenir  
  - Mesajlar Redis’te saklanır  
- **Mesaj geçmişi**  
  - Redis listeleriyle tüm konuşmalar loglanır  
  - “Gönder” tuşuna basınca geçmiş otomatik yüklenir ve görüntülenir  
- **Docker & Docker Compose**  
  - Backend, frontend ve Redis tek komutla ayağa kalkar  
  - Çok aşamalı (multi-stage) Dockerfile’lar  
  - `docker-compose.yml` ile volume ve network yönetimi  
- **Çevre değişkenleri**  
  - Backend: `REDIS_URL`, `PORT`  
  - Frontend (opsiyonel): `VITE_BACKEND_URL`

> ⚠️ **Henüz eklenmedi (planlanan):**  
> - Grup sohbeti (grup oluşturma, davetler, grup içi mesajlaşma)

---

## 🛠️ Teknolojiler

- **Frontend**: React + Vite + Socket.IO-client  
- **Backend**: Node.js + Express + Socket.IO + Redis  
- **Containerization**: Docker, Docker Compose  
- **Veri Deposu**: Redis (kalıcı volume ile)

