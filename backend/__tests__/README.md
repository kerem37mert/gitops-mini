# Backend Tests

Bu dizin, backend API'si için basit test dosyalarını içerir.

## Test Yapısı

- **`auth.test.js`** - Kimlik doğrulama endpoint'leri için testler (login, logout, getCurrentUser)
- **`apps.test.js`** - Uygulama yönetimi endpoint'leri için testler (getApps, getApp)
- **`users.test.js`** - Kullanıcı yönetimi endpoint'leri için testler (CRUD işlemleri)
- **`db.test.js`** - Veritabanı şeması ve kısıtlamaları için testler

## Testleri Çalıştırma

```bash
# Tüm testleri çalıştır
npm test

# Coverage raporu ile çalıştır
npm run test:coverage
```

## Test Kapsamı

Testler şu alanları kapsar:

### Authentication (Kimlik Doğrulama)
- ✅ Geçerli kimlik bilgileri ile giriş
- ✅ Geçersiz kimlik bilgileri ile giriş hatası
- ✅ Eksik kimlik bilgileri ile hata
- ✅ Token ile mevcut kullanıcı bilgisi alma
- ✅ Token olmadan erişim hatası
- ✅ Geçersiz token ile hata
- ✅ Başarılı çıkış

### Apps (Uygulamalar)
- ✅ Token ile uygulama listesi alma
- ✅ Token olmadan erişim hatası
- ✅ Var olmayan uygulama için 404 hatası

### Users (Kullanıcılar)
- ✅ Superuser token ile kullanıcı listesi alma
- ✅ Yeni kullanıcı oluşturma
- ✅ Duplicate kullanıcı adı ile hata (409)
- ✅ Eksik alanlar ile hata
- ✅ Kullanıcı rolü güncelleme
- ✅ Var olmayan kullanıcı için 404 hatası
- ✅ Kullanıcı silme
- ✅ Kimlik doğrulama ve yetkilendirme kontrolleri

### Database (Veritabanı)
- ✅ Apps tablosu oluşturma
- ✅ Users tablosu oluşturma
- ✅ Veri ekleme ve okuma
- ✅ Unique constraint kontrolü

## Teknolojiler

- **Jest** - Test framework'ü
- **Supertest** - HTTP assertion'ları için
- **Babel** - ES modules desteği için

## Notlar

- Testler izole bir test veritabanı kullanır
- Her test suite kendi setup ve cleanup işlemlerini yapar
- Tüm testler authentication token'ları ile çalışır
