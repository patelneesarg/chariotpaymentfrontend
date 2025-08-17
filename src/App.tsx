import { useEffect, useState } from "react";
import axios from "axios";

interface Payment {
    id: string;
    amount: number;
    currency: string;
    scheduled_date: string;
    recipient: string;
    within24Hours: boolean;
}

function App() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [recipient, setRecipient] = useState("");
    const [after, setAfter] = useState("");

    const fetchPayments = async () => {
        try {
            const params: any = {};
            if (recipient) params.recipient = recipient;
            if (after) params.after = after;

            const res = await axios.get("http://localhost:8080/api/payments", { params });
            setPayments(res.data.payments);
            setTotal(res.data.totalAmount);
        } catch (err) {
            console.error("Error fetching payments", err);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <div className="container">
            <h1>Pending Payments</h1>

            {/* Filters */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <span
                    style={{
                        marginLeft: '8px',
                        fontSize: '0.9em',
                        color: '#555',
                        lineHeight: '28px'
                    }}
                >
                    Get payments after
                </span>
                <input
                    type="date"
                    value={after}
                    onChange={(e) => setAfter(e.target.value)}
                />
                <button onClick={fetchPayments}>Apply Filters</button>
            </div>

            {/* Table */}
            <table className="payments-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Recipient</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Scheduled Date</th>
                    <th>Within 24 Hours?</th>
                </tr>
                </thead>
                <tbody>
                {payments.map((p) => (
                    <tr key={p.id} className={p.within24Hours ? "highlight" : ""}>
                        <td>{p.id}</td>
                        <td>{p.recipient}</td>
                        <td>${p.amount.toLocaleString()}</td>
                        <td>{p.currency}</td>
                        <td>{p.scheduled_date}</td>
                        <td>{p.within24Hours ? "Yes" : "No"}</td>
                    </tr>
                ))}
                </tbody>
            </table>


            {/* Total */}
            <div className="total">Total Amount: ${total}</div>
        </div>

    );
}

export default App;
