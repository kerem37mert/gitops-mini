# Frontend Testing Guide

Bu doküman, GitOps Mini projesinde frontend testlerinin nasıl yazılacağını ve çalıştırılacağını açıklar.

## Test Altyapısı

Projede aşağıdaki test araçları kullanılmaktadır:

- **Vitest** - Modern, hızlı test framework (Vite ile native entegrasyon)
- **React Testing Library** - React component test utilities
- **jsdom** - DOM environment simulation

## Test Komutları

```bash
# Tüm testleri çalıştır
npm test

# Watch mode ile testleri çalıştır (değişiklikleri otomatik algılar)
npm test -- --watch

# UI ile testleri görüntüle
npm run test:ui

# Coverage raporu oluştur
npm run test:coverage

# Belirli bir dosyayı test et
npm test StatusBadge.test.jsx
```

## Test Dosya Yapısı

Test dosyaları, test edilen dosyanın yanında `.test.jsx` veya `.test.js` uzantısı ile oluşturulur:

```
src/
├── components/
│   └── StatusBadge/
│       ├── StatusBadge.jsx
│       ├── StatusBadge.module.css
│       └── StatusBadge.test.jsx      ← Test dosyası
├── contexts/
│   ├── AuthContext.jsx
│   └── AuthContext.test.jsx          ← Test dosyası
└── helpers/
    ├── formatDate.js
    └── formatDate.test.js            ← Test dosyası
```

## Test Yazma Örnekleri

### 1. Component Testi

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('renders correct text for active status', () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText('Başarılı')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<StatusBadge status="active" />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('badge');
    expect(badge).toHaveClass('active');
  });
});
```

### 2. Context Testi

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock fetch
global.fetch = vi.fn();

const TestComponent = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return <div>{user ? user.username : 'No user'}</div>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('initializes with no user when no token', async () => {
    localStorage.getItem.mockReturnValue(null);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No user')).toBeInTheDocument();
    });
  });
});
```

### 3. Helper Function Testi

```jsx
import { describe, it, expect } from 'vitest';
import formatDate from './formatDate';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const testDate = new Date('2024-12-02T15:30:00');
    const formatted = formatDate(testDate);
    
    expect(formatted).toContain('.');
    expect(formatted).toContain(':');
  });
});
```

### 4. User Interaction Testi

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    await user.type(usernameInput, 'testuser');
    
    expect(usernameInput).toHaveValue('testuser');
  });
});
```

## Best Practices

### 1. Test Organizasyonu

- Her test dosyası için `describe` bloğu kullanın
- İlgili testleri gruplamak için nested `describe` blokları kullanın
- Test isimleri açıklayıcı olmalı (ne test edildiğini belirtmeli)

```jsx
describe('ComponentName', () => {
  describe('rendering', () => {
    it('renders with default props', () => { /* ... */ });
    it('renders with custom props', () => { /* ... */ });
  });

  describe('user interactions', () => {
    it('handles click events', () => { /* ... */ });
  });
});
```

### 2. Cleanup ve Setup

- `beforeEach` ile her test öncesi temizlik yapın
- `afterEach` ile her test sonrası cleanup yapın
- Mock'ları her test öncesi sıfırlayın

```jsx
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});
```

### 3. Async Testing

- `waitFor` kullanarak async işlemleri bekleyin
- `findBy` queries kullanarak async elementleri bulun

```jsx
// waitFor kullanımı
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// findBy kullanımı (otomatik olarak bekler)
const element = await screen.findByText('Loaded');
expect(element).toBeInTheDocument();
```

### 4. Mocking

#### API Calls

```jsx
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'test' })
  })
);
```

#### LocalStorage

```jsx
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
global.localStorage = localStorageMock;
```

#### Environment Variables

```jsx
import.meta.env.VITE_API_URL = 'http://test-api.com';
```

### 5. Queries Seçimi

React Testing Library'de doğru query'yi seçmek önemlidir:

1. **getByRole** - En çok tercih edilen (accessibility)
2. **getByLabelText** - Form elementleri için
3. **getByText** - Text içeriği için
4. **getByTestId** - Son çare (data-testid attribute)

```jsx
// İyi ✅
const button = screen.getByRole('button', { name: /submit/i });

// Kabul edilebilir ✓
const input = screen.getByLabelText(/username/i);

// Son çare ⚠️
const element = screen.getByTestId('custom-element');
```

## Coverage Raporu

Coverage raporunu görüntülemek için:

```bash
npm run test:coverage
```

Bu komut:
- Terminal'de özet rapor gösterir
- `coverage/` klasöründe HTML rapor oluşturur
- `coverage/index.html` dosyasını tarayıcıda açarak detaylı rapor görüntüleyebilirsiniz

## Yaygın Hatalar ve Çözümleri

### 1. "Cannot find module" hatası

**Çözüm:** Import path'lerini kontrol edin, relative path kullanın.

### 2. "Not wrapped in act(...)" uyarısı

**Çözüm:** `waitFor` veya `findBy` kullanarak async işlemleri bekleyin.

```jsx
// Yanlış ❌
render(<Component />);
expect(screen.getByText('Async Text')).toBeInTheDocument();

// Doğru ✅
render(<Component />);
await screen.findByText('Async Text');
```

### 3. CSS Module import hataları

**Çözüm:** `vitest.config.js` dosyasında CSS module mock'ları zaten yapılandırılmıştır.

## Daha Fazla Bilgi

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
