import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { supplierName: 'asc' },
    });
    
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suppliers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { supplierName, contactPerson, phone, email, address } = body;
    const userId = request.headers.get('x-user-id');

    if (!supplierName) {
      return NextResponse.json(
        { error: 'Supplier name is required' },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.create({
      data: {
        supplierName,
        contactPerson,
        phone,
        email,
        address,
      },
    });

    // Log activity
    await logActivity({
      userId: userId ? parseInt(userId) : null,
      action: 'CREATE',
      entityType: 'SUPPLIER',
      entityId: supplier.supplierId,
      entityName: supplier.supplierName,
      details: `Created supplier: ${supplier.supplierName}`,
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { error: 'Failed to create supplier' },
      { status: 500 }
    );
  }
}
