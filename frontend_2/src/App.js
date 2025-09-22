import FileCmp from "./FileCmp";
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
 
  return (
     <BrowserRouter>
    <div >
     <Routes>
       <Route path='/' element={<FileCmp/>}/>
     </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
