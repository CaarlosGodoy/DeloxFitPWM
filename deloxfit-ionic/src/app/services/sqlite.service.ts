import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private isReady = false;

  constructor() { }

  async initDatabase() {
    if (this.isReady) return;

    try {
      if (Capacitor.getPlatform() === 'web') {
        console.warn('SQLite no está soportado nativamente en la web sin jeep-sqlite. Ejecutando mocks de base de datos.');
        this.isReady = true;
        return;
      }

      this.db = await this.sqlite.createConnection('deloxfit_db', false, 'no-encryption', 1, false);
      await this.db.open();

      const query = `
        CREATE TABLE IF NOT EXISTS favorites (
          id TEXT PRIMARY KEY,
          nombre TEXT,
          precio TEXT,
          descripcion TEXT,
          imagen TEXT
        );
      `;
      await this.db.execute(query);

      this.isReady = true;
    } catch (error) {
      console.error('Error inicializando SQLite', error);
    }
  }

  async addFavorite(item: any): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      const favs = JSON.parse(localStorage.getItem('mock_favs_data') || '[]');
      if (!favs.find((f: any) => f.id === item.id)) {
        favs.push(item);
        localStorage.setItem('mock_favs_data', JSON.stringify(favs));
      }
      return;
    }
    const query = `INSERT INTO favorites (id, nombre, precio, descripcion, imagen) VALUES (?, ?, ?, ?, ?)`;
    await this.db.run(query, [item.id, item.nombre, item.precio, item.descripcion, item.imagen]);
  }

  async removeFavorite(id: string): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      let favs = JSON.parse(localStorage.getItem('mock_favs_data') || '[]');
      favs = favs.filter((f: any) => f.id !== id);
      localStorage.setItem('mock_favs_data', JSON.stringify(favs));
      return;
    }
    const query = `DELETE FROM favorites WHERE id = ?`;
    await this.db.run(query, [id]);
  }

  async isFavorite(id: string): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') {
      const favs = JSON.parse(localStorage.getItem('mock_favs_data') || '[]');
      return favs.some((f: any) => f.id === id);
    }
    const query = `SELECT * FROM favorites WHERE id = ?`;
    const res = await this.db.query(query, [id]);
    return res.values !== undefined && res.values.length > 0;
  }

  async getFavorites(): Promise<any[]> {
    if (Capacitor.getPlatform() === 'web') {
      return JSON.parse(localStorage.getItem('mock_favs_data') || '[]');
    }
    const query = `SELECT * FROM favorites`;
    const res = await this.db.query(query);
    return res.values || [];
  }

  async getFavoritesIds(): Promise<string[]> {
    if (Capacitor.getPlatform() === 'web') {
      const favs = JSON.parse(localStorage.getItem('mock_favs_data') || '[]');
      return favs.map((f: any) => f.id);
    }
    const query = `SELECT id FROM favorites`;
    const res = await this.db.query(query);
    if (res.values) {
      return res.values.map((row: any) => row.id);
    }
    return [];
  }
}
