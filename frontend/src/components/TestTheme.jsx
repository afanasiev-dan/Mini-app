// TestTheme.jsx
export default function TestTheme() {
    return (
      <div style={{ padding: '20px', border: '2px solid red' }}>
        <h1>Тест Темы</h1>
        <p>Цвет этого текста и фона должен меняться.</p>
        <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', padding: '10px' }}>
          Вложенный div с переменными
        </div>
      </div>
    );
  }