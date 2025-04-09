import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Layout from './Layout.jsx'
import { HelmetProvider } from 'react-helmet-async'

window.addEventListener("beforeunload", () => {
  localStorage.clear();

  console.log("페이지를 떠날 때 localStorage에서 tempData 삭제됨.");
});

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <HelmetProvider>
    <Layout>
      <App />
    </Layout>   
    </HelmetProvider>
  //</StrictMode>,
)
