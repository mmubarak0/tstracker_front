import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import TransactionsView from "./views/TransactionsView";
import CreateTransactionView from "./views/CreateTransactionView";
import Sidebar from "./components/Sidebar";
import "./App.css";
import store from "./store";
import DashboardView from "./views/DashboardView";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex h-full">
          <Sidebar />
          <div className="md:ml-64 p-4 w-full">
            <Routes>
              <Route path="/" element={<DashboardView />} />
              <Route path="/transactions" element={<TransactionsView />} />
              <Route
                path="/create_transaction"
                element={<CreateTransactionView />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
