import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type PortfolioWithViews = {
  viewCount: number;
  viewTimestamps: Date[];
};

type Props = {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function GET(req: NextRequest, props: Props) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: {
        ownerId: props.params.userId,
      }
    }) as unknown as PortfolioWithViews;

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const recentViews = portfolio.viewTimestamps
      .sort((a: Date, b: Date) => b.getTime() - a.getTime())
      .slice(0, 10);

    return NextResponse.json({
      viewCount: portfolio.viewCount,
      recentViews
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
} 