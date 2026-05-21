import { SiteData } from './database.service';

export function subscriptionImageName(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('anual')) return 'anual.png';
  if (titleLower.includes('diario')) return 'diario.png';
  if (titleLower.includes('familiar')) return 'familiar.png';
  if (titleLower.includes('mensual')) return 'mensual.png';
  if (titleLower.includes('semestral')) return 'semestral.png';
  return 'gratis.png';
}

export function mapSubscriptionsToItems(data: SiteData | null | undefined): any[] {
  if (!data?.subscriptions?.length) return [];

  return data.subscriptions.map(sub => ({
    id: sub.title.toLowerCase().replace(/\s/g, '-'),
    nombre: sub.title,
    precio: sub.price,
    descripcion: `Suscripción de ${sub.title} por ${sub.price}`,
    imagen: `assets/images/${subscriptionImageName(sub.title)}`
  }));
}
