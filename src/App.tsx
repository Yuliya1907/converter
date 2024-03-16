import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
  const [ethAmount, setEthAmount] = useState<string>('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [usdtPrice, setUsdtPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
          params: {
            symbol: 'ETHUSDT'
          }
        });
        setUsdtPrice(parseFloat(response.data.price));
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    };
    fetchPrice();
  }, []);

  const handleEthAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // Перевіряємо, чи введені дані є числом
    if (!isNaN(parseFloat(value))) {
      setEthAmount(value);
    }
  };

  const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(event.target.value as 'buy' | 'sell');
  };

  const calculateUsdtAmount = () => {
    const ethAmountFloat = parseFloat(ethAmount);
    if (!isNaN(ethAmountFloat) && usdtPrice !== null) {
      if (action === 'buy') {
        return ethAmountFloat * usdtPrice;
      } else {
        return ethAmountFloat / usdtPrice;
      }
    }
    return null;
  };

  return (
    <div className="container">
    <h1 className="title">USDT/ETH Price Converter</h1>
    <div className="input-container">
      <label className="input-label">
        Amount of ETH:
        <input className="input-field amount" type="text" value={ethAmount} onChange={handleEthAmountChange} />
      </label>
      <label className="input-label">
        Action:
        <select className="input-field" value={action} onChange={handleActionChange}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </label>
    </div>
    {usdtPrice !== null && (
      <div className="result-container">
        <h2 className="price">Current USDT/ETH Price: {usdtPrice}</h2>
        <h2 className="result">
          You will receive:{' '}
          {calculateUsdtAmount()}
        </h2>
      </div>
    )}
  </div>
);
};

export default App;
