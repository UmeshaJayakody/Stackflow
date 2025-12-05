import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { customerName: 'asc' },
    });

    const data = customers.map((customer) => ({
      'Customer ID': customer.customerId,
      'Customer Name': customer.customerName,
      'Phone': customer.phone || 'N/A',
      'Email': customer.email || 'N/A',
      'Address': customer.address || 'N/A',
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching customers report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers report' },
      { status: 500 }
    );
  }
}
