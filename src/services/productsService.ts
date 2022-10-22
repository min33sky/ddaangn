import { prisma } from '@/lib/prisma';

export const productsService = {
  async getProducts() {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        id: {
          lt: undefined, // TODO:  infinite scroll할 때 id값을 넣어주면 됨
        },
      },
      include: {
        _count: {
          select: {
            favorites: true,
          },
        },
      },
      take: 10,
    });

    return products;
  },

  async getProductsIds() {
    const ids = await prisma.product.findMany({
      select: {
        id: true,
      },
    });

    return ids;
  },

  async getProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        favorites: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const terms = product.name.split(' ').map((term) => ({
      name: {
        contains: term,
      },
    }));

    const relatedProducts = await prisma.product.findMany({
      where: {
        OR: terms,
        AND: {
          id: {
            not: product.id, // 현재 상품 제외
          },
        },
      },
      take: 4,
    });

    return {
      product,
      relatedProducts,
    };
  },
};
