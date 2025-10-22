// src/components/App.jsx
import { useLaunchParams, miniApp, useSignal } from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

export function App() {
  // Даже если не используешь — вызов нужен для инициализации
  useLaunchParams();
  const isDark = useSignal(miniApp.isDark);

  return (
    <AppRoot
      appearance={isDark ? 'dark' : 'light'}
      platform={['ios', 'macos'].includes(miniApp.platform) ? 'ios' : 'base'}
    >
      <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
        <h1>✅ Работает!</h1>
        <p>Mini App загружен.</p>
      </div>
    </AppRoot>
  );
}



    {/* <AppRoot */}
    {/*   appearance={isDark ? 'dark' : 'light'} */}
    {/*   platform={['macos', 'ios'].includes(lp.platform) ? 'ios' : 'base'} */}
    {/* > */}
    {/*   <HashRouter> */}
    {/*     <Routes> */}
    {/*       {routes.map((route) => <Route key={route.path} {...route} />)} */}
    {/*       <Route path="*" element={<Navigate to="/"/>}/> */}
    {/*     </Routes> */}
    {/*   </HashRouter> */}
    {/* </AppRoot> */}
