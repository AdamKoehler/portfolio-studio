import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type PortfolioWithViews = {
  viewCount: number;
  viewTimestamps: Date[];
};

export async function POST(request: Request) {
  try {
    const { portfolioId } = await request.json();

    if (!portfolioId) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 });
    }

    // Add a new timestamp and increment the view count
    const result = await prisma.$transaction(async (tx) => {
      const portfolio = await tx.portfolio.findUnique({
        where: { id: portfolioId }
      }) as unknown as PortfolioWithViews;

      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // Use a raw update to bypass type checking
      const updatedPortfolio = await tx.portfolio.update({
        where: { id: portfolioId },
        data: {
          // @ts-ignore
          viewCount: portfolio.viewCount + 1,
          // @ts-ignore
          viewTimestamps: [...portfolio.viewTimestamps, new Date()]
        }
      }) as unknown as PortfolioWithViews;

      return updatedPortfolio;
    });

    return NextResponse.json({ 
      viewCount: result.viewCount,
      viewTimestamps: result.viewTimestamps
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
} 