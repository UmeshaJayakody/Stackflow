import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LogActivityParams {
  userId: number | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'PRODUCT' | 'PURCHASE' | 'SALE' | 'SUPPLIER' | 'CUSTOMER';
  entityId?: number;
  entityName?: string;
  details?: string;
}

export async function logActivity(params: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        entityName: params.entityName,
        details: params.details,
      },
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - logging shouldn't break the main operation
  }
}
