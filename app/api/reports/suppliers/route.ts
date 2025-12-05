import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { supplierName: 'asc' },
    });

    const data = suppliers.map((supplier) => ({
      'Supplier ID': supplier.supplierId,
      'Supplier Name': supplier.supplierName,
      'Contact Person': supplier.contactPerson || 'N/A',
      'Phone': supplier.phone || 'N/A',
      'Email': supplier.email || 'N/A',
      'Address': supplier.address || 'N/A',
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching suppliers report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers report' },
      { status: 500 }
    );
  }
}
