import React, { useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import axios from 'axios';
import { Dropdown, message, Modal, Table } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from "react-router";
import Title from 'antd/es/typography/Title';

export type LineItem = {
    id: number;
    invoiceID: number;
    description: string;
    quantity: number;
    amount: number;
};

export type Invoice = {
    id: number;
    customerDetails: string;
    date: string;
    totalAmount: number;
    lineItems: LineItem[];
};

function Invoices() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    const InvoiceTable = () => {
        const navigate = useNavigate();

        const onMenuClick: MenuProps['onClick'] = (e) => {
            const [action, invoiceId] = e.key.split(':');

            if (action === 'view') {
                navigate(`/invoices/${invoiceId}`);
            } else if (action === 'edit') {
                navigate(`/invoices/create/${invoiceId}`);
            } else if (action === 'delete') {
                Modal.confirm({
                    title: "Are you sure want to delete this record?",
                    onOk: async () => {
                        try {
                            await axios.delete(`api/invoice/${invoiceId}`);
                            setInvoices(invoices.filter((i, _) => i.id !== parseInt(invoiceId)))
                            message.success('Record is deleted successfully.');
                        } catch (error) {
                            message.error('Failed to delete invoice.');
                            console.error('Error deleting the invoices', error);
                        }
                    }
                });
            }
        };

        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                defaultSortOrder: 'descend',
                sorter: (a: Invoice, b: Invoice) => a.id - b.id,
            },
            {
                title: 'Customer Details',
                dataIndex: 'customerDetails',
            },
            {
                title: 'Date',
                render: (_: any, record: Invoice) => (
                    <span>{new Date(record.date).toLocaleString()}</span>
                ),
                sorter: (a: Invoice, b: Invoice) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            },
            {
                title: 'Total Amount',
                sorter: (a: Invoice, b: Invoice) => a.totalAmount - b.totalAmount,
                render: (_: any, record: Invoice) => (
                    <span>${record.totalAmount.toFixed(2)}</span>
                )
            },
            {
                title: 'Actions',
                render: (_: any, record: Invoice) => {
                    const items: MenuProps['items'] = [
                        {
                            label: 'View Invoice',
                            key: `view:${record.id}`,
                        },
                        {
                            label: 'Edit Invoice',
                            key: `edit:${record.id}`,
                        },
                        {
                            label: 'Delete Invoice',
                            key: `delete:${record.id}`,
                        },
                    ];

                    return (
                        <Dropdown.Button menu={{ items, onClick: onMenuClick }}>
                            Actions
                        </Dropdown.Button>
                    );
                },
            },
        ];

        return <Table columns={columns} dataSource={invoices} rowKey="id" />;
    };

    useEffect(() => {
        async function fetchInvoices() {
            try {
                const response = await axios.get('api/invoice');
                setInvoices(response.data);
            } catch (error) {
                console.error('Error fetching the invoices', error);
            }
        }

        fetchInvoices();
    }, []);

    return (
        <Container>
            <Title level={2}>Invoices</Title>
            <InvoiceTable />
        </Container>
    );
}

export { Invoices };
