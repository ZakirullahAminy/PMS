// App.jsx
import { useState } from "react";
import Product from "./Product";
import Login from "./Login";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return <Product user={user} />;
}

export default App;
