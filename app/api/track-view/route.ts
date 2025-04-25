import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface PortfolioWithViews {
  viewCount: number;
  viewTimestamps: Date[];
}

export async function POST(request: Request) {
  try {
    const { portfolioId } = await request.json();

    if (!portfolioId) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId }
    }) as unknown as PortfolioWithViews;

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // Initialize viewCount and viewTimestamps if they don't exist
    const currentViewCount = portfolio.viewCount || 0;
    const currentTimestamps = portfolio.viewTimestamps || [];

    const result = await prisma.portfolio.update({
      where: { id: portfolioId },
      data: {
        // @ts-ignore - Fields exist in schema but types aren't being generated correctly
        viewCount: currentViewCount + 1,
        viewTimestamps: [...currentTimestamps, new Date()]
      }
    }) as unknown as PortfolioWithViews;

    return NextResponse.json({
      viewCount: result.viewCount,
      viewTimestamps: result.viewTimestamps
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
} 