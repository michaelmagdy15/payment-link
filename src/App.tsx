
import { ProductSummary } from './components/ProductSummary';
import { PaymentForm } from './components/PaymentForm';

function App() {
  return (
    <div className="min-h-screen lg:flex bg-white">
      {/* Left Pane - Summary */}
      <div className="lg:w-1/2 lg:fixed lg:inset-y-0 lg:left-0 bg-white h-auto border-b lg:border-b-0 lg:border-r border-slate-200">
        <ProductSummary />
      </div>

      {/* Right Pane - Payment Form */}
      <div className="lg:w-1/2 lg:ml-auto min-h-screen flex flex-col justify-center">
        <PaymentForm />
      </div>
    </div>
  );
}

export default App;
