import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const efforts = await prisma.effort.findMany({
    include: { athlete: true, segment: true, stage: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  return NextResponse.json({ efforts });
}

export async function POST(req: NextRequest) {
  const { id, isValid } = await req.json();
  if (!id || typeof isValid !== 'boolean') return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  await prisma.effort.update({ where: { id }, data: { isValid } });
  return NextResponse.json({ ok: true });
}
