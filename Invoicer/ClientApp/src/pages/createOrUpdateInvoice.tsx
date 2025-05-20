import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, InputNumber, message, Space, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { Invoice, LineItem } from './invoices';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router";
import axios from 'axios';
import dayjs from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';
const { Title } = Typography;

const layout = {
  labelCol: { sm:{ span: 8 }},
  wrapperCol: { sm: { span: 16 }},
};

const itemsLayout = {
  wrapperCol: { md: {offset: 8, span: 16} },
};

const tailLayout = {
  wrapperCol: { md: { offset: 8, span: 16 } },
};

const initialValues = { date: dayjs(), totalAmount: 0.00, lineItmes: [] };

const CreateOrUpdateInvoice: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    let { id } = useParams();
    const isEditing = !!id;

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current > dayjs().endOf('day');
    };

    const lineItems = Form.useWatch("lineItems", form);

    const totalAmount = useMemo(() => {
        if (!lineItems) return 0;

        return lineItems.reduce((sum: number, item: LineItem) => {
            const qty = item?.quantity || 0;
            const amt = item?.amount || 0;
            return sum + qty * amt;
        }, 0);
    }, [lineItems]);

    const onFinish = async (values: Invoice) => {
        setLoading(true);

        const payload = {
            ...values,
            totalAmount: totalAmount
        }

        try {
            if (!isEditing) {
                await axios.post('api/invoice', payload);
                message.success('Invoice created successfully.');
            } else {
                await axios.put(`api/invoice/${id}`, payload);
                message.success('Invoice updated successfully.');
            }
            navigate('/invoices');
        } catch (err) {
            console.error('Failed to save invoice ', err);
            message.error('Failed to save invoice.');
        } finally {
            setLoading(false);
        }
    };

    const onAbort = () => {
        navigate('/invoices')
    };

    useEffect(() => {
        async function fetchInvoice() {
            if (!id) {
                return;
            }

            try {
                const response = await axios.get(`api/invoice/${id}`);
                form.setFieldsValue({
                    ...response.data,
                    date: response.data.date ? dayjs(response.data.date) : dayjs()
                });
            } catch (error) {
                console.error('Error fetching the invoices', error);
            }
        }

        fetchInvoice();
    }, [form, id]);

    return (
        <Form {...layout} form={form} name="invoice_form" onFinish={onFinish} onAbort={onAbort} autoComplete="off" initialValues={initialValues}>
            <Title level={2}>{isEditing ? "Update Invoice" : "Create Invoice"}</Title>

            <Form.Item name="customerDetails" label="Customer Details" rules={[{ required: true, message: 'Customer details is required' }]}>
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Date is required' }]}>
                <DatePicker showTime={true} disabledDate={disabledDate} className='w-100' />
            </Form.Item>
            <Form.Item label="Total Amount">
                <Title level={4}>${totalAmount.toFixed(2)}</Title>
            </Form.Item>
            <Divider/>
            <Form.Item label={<h4>Order Lines</h4>} colon={false}>
            </Form.Item>
            <Form.List name="lineItems">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(field => (
                            <Form.Item key={field.key} {...itemsLayout}>
                                <Space align="baseline">
                                    <Form.Item
                                        label="Description"
                                        name={[field.name, 'description']}
                                        rules={[{ required: true, message: 'Description is required' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Quantity"
                                        name={[field.name, 'quantity']}
                                        rules={[
                                            { required: true, message: 'Quantity is required' }, 
                                            { type: 'number', min: 1, message: 'Invalid quantity' }
                                        ]}
                                    >
                                        <InputNumber step={1} />
                                    </Form.Item>

                                    <Form.Item
                                        label="Amount"
                                        name={[field.name, 'amount']}
                                        rules={[
                                            { required: true, message: 'Amount is required' }, 
                                            { type: 'number', min: 0, message: 'Invalid amount' }
                                        ]}
                                    >
                                        <InputNumber step={0.01} />
                                    </Form.Item>

                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                </Space>
                            </Form.Item>
                        ))}

                        <Form.Item {...tailLayout}>
                            <Button type="dashed" onClick={() => add({ quantity: 1, amount: 0.0 })} block icon={<PlusOutlined />}>
                                Add New Line
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" disabled={loading}>
                    Save
                </Button>
                <Button type="default" onClick={() => navigate('/invoices')} className='ms-2'>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateOrUpdateInvoice;