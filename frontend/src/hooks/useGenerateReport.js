import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const useGenerateReport = () => {
    const [reportUrl, setReportUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const generateInventoryReport = async (userId) => {
        setLoading(true);
        setReportUrl('');

        try {
            const response = await axios.get('/api/reports/inventory-report', {
                params: { userId }
            });

            if (response.data.success) {
                setReportUrl(response.data.fileUrl);
                toast.success('Inventory report generated successfully!');
            } else {
                throw new Error(response.data.message || 'Failed to generate report');
            }
        } catch (err) {
            console.error('Error generating inventory report:', err);
            toast.error(err?.response?.data?.message || 'Failed to generate inventory report');
        } finally {
            setLoading(false);
        }
    };

    return { reportUrl, loading, generateInventoryReport };
};