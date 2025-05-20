import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Descriptions, Button, Spin, Alert, Card, Table, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { Invoice } from './invoices';
import { useReactToPrint } from "react-to-print";
const { Text } = Typography;

const ViewInvoice: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const contentRef = useRef<HTMLDivElement>(null);
    const printInvoice = useReactToPrint({ bodyClass: 'p-4', contentRef });

    const columns = [
        {
            title: (<Text strong italic>Description</Text>),
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: (<Text strong italic>Quanitty</Text>),
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: (<Text strong italic>Amount</Text>),
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `$${amount.toFixed(2)}`,
        },
    ];

    useEffect(() => {
        async function fetchInvoice() {
            try {
                const response = await axios.get(`api/invoice/${id}`);
                setInvoice(response.data);
            } catch (err) {
                setError('Error fetching the invoice');
            } finally {
                setLoading(false);
            }
        }

        fetchInvoice();
    }, [id]);

    return (
        <div>
            <Card
                title='Invoice Details'
                extra={[
                    <Button key="1" onClick={printInvoice} type="primary">
                        Print Invoice
                    </Button>,
                ]}
                style={{ marginBottom: '20px' }}
            >
                {loading ? (
                    <Spin size="large" />
                ) : error ? (
                    <Alert message={error} type="error" />
                ) : (
                    <div ref={contentRef}>
                        <Descriptions bordered>
                            <Descriptions.Item label="Invoice ID">{invoice?.id}</Descriptions.Item>
                            <Descriptions.Item label="Date" span={2}>{new Date(invoice?.date!).toLocaleDateString()}</Descriptions.Item>
                            <Descriptions.Item label="Total Amount">${invoice?.totalAmount.toFixed(2)}</Descriptions.Item>
                            <Descriptions.Item label="Customer Details" span={2}>{invoice?.customerDetails}</Descriptions.Item>
                        </Descriptions>

                        <div className='mt-2'>
                            <Table
                                dataSource={invoice?.lineItems}
                                columns={columns}
                                pagination={false}
                                rowKey="id"
                                summary={() => (
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0}><Text strong italic>Total</Text></Table.Summary.Cell>
                                        <Table.Summary.Cell index={0} />
                                        <Table.Summary.Cell index={0}>
                                            <Text strong>${invoice?.totalAmount.toFixed(2)}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                )}
                            />
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ViewInvoice;
