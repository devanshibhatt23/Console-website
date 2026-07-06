import { supabase } from "./lib/supabase";
import "./App.css";

function App() {
  console.log(supabase);

  return (
    <div>
      <h1>Supabase Connected 🚀</h1>
      <p>Console Website Setup Successful</p>
    </div>
  );
}

export default App;