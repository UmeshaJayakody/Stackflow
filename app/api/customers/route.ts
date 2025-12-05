import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activityLogger';

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { customerName: 'asc' },
    });
    
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, phone, email, address } = body;
    const userId = request.headers.get('x-user-id');

    if (!customerName) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        customerName,
        phone,
        email,
        address,
      },
    });

    // Log activity
    await logActivity({
      userId: userId ? parseInt(userId) : null,
      action: 'CREATE',
      entityType: 'CUSTOMER',
      entityId: customer.customerId,
      entityName: customer.customerName,
      details: `Created customer: ${customer.customerName}`,
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
