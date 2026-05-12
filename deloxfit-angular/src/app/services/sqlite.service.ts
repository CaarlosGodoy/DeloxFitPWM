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

  constructor() {}

  async initDatabase() {
    if (this.isReady) return;

    try {
      // En entorno de desarrollo (Web), el plugin nativo puede no estar disponible.
      if (Capacitor.getPlatform() === 'web') {
        console.warn('SQLite no está soportado nativamente en la web sin jeep-sqlite. Ejecutando mocks de base de datos.');
        this.isReady = true;
        return;
      } 

      // Creamos la conexión a la base de datos local
      this.db = await this.sqlite.createConnection('deloxfit_db', false, 'no-encryption', 1, false);
      await this.db.open();

      // Creamos la tabla de favoritos si no existe
      const query = `
        CREATE TABLE IF NOT EXISTS favorites (
          id TEXT PRIMARY KEY
        );
      `;
      await this.db.execute(query);
      
      this.isReady = true;
    } catch (error) {
      console.error('Error inicializando SQLite', error);
    }
  }

  // Las funciones siguientes simulan el comportamiento en web usando LocalStorage
  // para que puedas probarlo en el navegador durante el desarrollo, 
  // pero usarán la DB real en el móvil.

  async addFavorite(id: string): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      const favs = JSON.parse(localStorage.getItem('mock_favs') || '[]');
      if (!favs.includes(id)) { favs.push(id); localStorage.setItem('mock_favs', JSON.stringify(favs)); }
      return;
    }
    const query = `INSERT INTO favorites (id) VALUES ('${id}')`;
    await this.db.run(query);
  }

  async removeFavorite(id: string): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      let favs = JSON.parse(localStorage.getItem('mock_favs') || '[]');
      favs = favs.filter((f: string) => f !== id);
      localStorage.setItem('mock_favs', JSON.stringify(favs));
      return;
    }
    const query = `DELETE FROM favorites WHERE id = '${id}'`;
    await this.db.run(query);
  }

  async isFavorite(id: string): Promise<boolean> {
    if (Capacitor.getPlatform() === 'web') {
      const favs = JSON.parse(localStorage.getItem('mock_favs') || '[]');
      return favs.includes(id);
    }
    const query = `SELECT * FROM favorites WHERE id = '${id}'`;
    const res = await this.db.query(query);
    return res.values !== undefined && res.values.length > 0;
  }

  async getFavoritesIds(): Promise<string[]> {
    if (Capacitor.getPlatform() === 'web') {
      return JSON.parse(localStorage.getItem('mock_favs') || '[]');
    }
    const query = `SELECT id FROM favorites`;
    const res = await this.db.query(query);
    if (res.values) {
      return res.values.map((row: any) => row.id);
    }
    return [];
  }
}
