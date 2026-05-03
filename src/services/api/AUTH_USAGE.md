# Autentifikácia - Návod na použitie

## Prihlásenie používateľa

```javascript
import { AuthApi } from '@/services/api/auth-api'

// V komponente alebo store
try {
  const response = await AuthApi.login({
    email: 'user@example.com',
    password: 'password123'
  })

  // Tokeny a user data sa automaticky uložia
  console.log('Prihlásený používateľ:', response.user)

  // Redirect na dashboard
  router.push('/dashboard')
} catch (error) {
  console.error('Prihlásenie zlyhalo:', error)
}
```

## Kontrola prihlásenia

```javascript
import { AuthApi } from '@/services/api/auth-api'

// Skontrolovať či je používateľ prihlásený
if (AuthApi.isAuthenticated()) {
  const user = AuthApi.getCurrentUser()
  console.log('Prihlásený ako:', user.email)
} else {
  console.log('Používateľ nie je prihlásený')
}
```

## Odhlásenie

```javascript
import { AuthApi } from '@/services/api/auth-api'

// Odhlásiť používateľa
await AuthApi.logout()

// Redirect na login
router.push('/login')
```

## Použitie v router guard

```javascript
// V router/index.js
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !AuthApi.isAuthenticated()) {
    // Nie je prihlásený, redirect na login
    next('/login')
  } else {
    next()
  }
})
```

## API volania s autentifikáciou

Všetky API volania cez `ApiService` automaticky pridajú autentifikačný token ak existuje:

```javascript
import { PostsApi } from '@/services/api/posts-api'

// Token sa automaticky pridá do hlavičky Authorization
const posts = await PostsApi.fetchPosts()
```

## Struktura uložených dát

Po úspešnom prihlásení sa uložia nasledovné dáta:

- `localStorage.authToken` - Access token pre API volania
- `localStorage.idToken` - ID token s informáciami o používateľovi
- `localStorage.refreshToken` - Refresh token pre obnovenie access tokenu
- `localStorage.userId` - ID používateľa
- `localStorage.user` - JSON objekt s informáciami o používateľovi

## Poznámky

- Tokeny sa automaticky pridávajú do všetkých API volaní
- Pri 401 chybe (Unauthorized) sa používateľ automaticky presmeruje na login
- JWT tokeny obsahujú informácie o používateľovi (email, meno, id)