import { useState, useEffect } from "react"
import { API_KEY, BASECURRENCY } from "../config";



const CurrencyConverter = () => {
    const [exchangeRates, setExchangeRates] = useState({});
    const [amount, setAmount] = useState(1);
    const [currency, setCurrency] = useState("EUR");
    const [currencies, setCurrencies] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {

        const fetchExchangeRates = async () => {
            try {
                const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASECURRENCY}`)
                if (!res.ok) {
                    throw new Error('Failed to fetch exchange rates');
                }

                const data = await res.json();

                setExchangeRates(data.conversion_rates);
                setCurrencies(Object.keys(data.conversion_rates));
                setError(null);
            } catch (err) {
                setError(err.message)
                console.error("Error while fetching", err);
            }
        }

        fetchExchangeRates();

    }, [])

    const getConvertedAmount = (curr) => {
        if (exchangeRates[curr]) {
            return (amount * exchangeRates[curr]).toFixed(2);
        }
        return 0
    }

    return (
        <div className="currency-converter">
            {error && <div className="error-message">{error}</div>}
            <h2>Currency Converter</h2>
            <div>
                <label>Amount in Euros (EUR):</label>
                <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />
            </div>
            <div>
                <label>Select Currency:</label>
                <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                >
                    {currencies.map(currencyCode => (
                        <option key={currencyCode} value={currencyCode}>
                            {currencyCode}
                        </option>
                    ))}
                </select>
            </div>
            <div className="currency-list">
                <h3>{amount} EUR = {getConvertedAmount(currency)} {currency} </h3>
                <h3>{amount} EUR = {getConvertedAmount("USD")} USD</h3>
                <h3>{amount} EUR = {getConvertedAmount("RSD")} RSD</h3>
                <h3>{amount} EUR = {getConvertedAmount("CHF")} CHF</h3>
                <h3>{amount} EUR = {getConvertedAmount("JPY")} JPY</h3>
            </div>
        </div>
    )
}


export default CurrencyConverter;