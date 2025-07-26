// Comprehensive error logger for CSV import debugging
export class CSVImportLogger {
  private static logs: string[] = [];
  private static maxLogs = 100;

  static log(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    
    if (data) {
      this.logs.push(`${logEntry} - ${JSON.stringify(data, null, 2)}`);
    } else {
      this.logs.push(logEntry);
    }
    
    // Keep only last 100 logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
    
    // Also log to console for immediate debugging
    console.log(logEntry, data || '');
  }

  static error(message: string, error?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ERROR: ${message}`;
    
    if (error) {
      const errorData = {
        message: error.message || error,
        stack: error.stack,
        name: error.name,
        code: error.code,
        details: error.details
      };
      this.logs.push(`${logEntry} - ${JSON.stringify(errorData, null, 2)}`);
    } else {
      this.logs.push(logEntry);
    }
    
    console.error(logEntry, error || '');
  }

  static warn(message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] WARN: ${message}`;
    
    if (data) {
      this.logs.push(`${logEntry} - ${JSON.stringify(data, null, 2)}`);
    } else {
      this.logs.push(logEntry);
    }
    
    console.warn(logEntry, data || '');
  }

  static getLogs(): string[] {
    return [...this.logs];
  }

  static clearLogs() {
    this.logs = [];
  }

  static exportLogs(): string {
    return this.logs.join('\n');
  }
}

// Global error handler for uncaught errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    CSVImportLogger.error('Uncaught error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    CSVImportLogger.error('Unhandled promise rejection', event.reason);
  });
}
