import ChurnDashboard from './ChurnDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ChurnDashboard />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;