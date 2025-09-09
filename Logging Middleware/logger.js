const LOG_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzd2F0ZWpzaW5naDkxQGdtYWlsLmNvbSIsImV4cCI6MTc1NzMyMjEzMiwiaWF0IjoxNzU3MzIxMjMyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNob2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZmVlNGEwNWEtZWE1Yy00ZWM4LWE5Y2YtZGEwNmY4NTZhMzNiIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic3dhdGVqIHNpbmdoIiwic3ViIjoiZmEwMGQzNTItYzRmZi00NDQ3LTgwMDItYTEzOWYyZGI2MzM5In0sImVtYWlsIjoic3dhdGVqc2luZ2g5MUBnbWFpbC5jb20iLCJuYW1lIjoic3dhdGVqIHNpbmdoIiwicm9sbE5vIjoiMjIwMTY0MTcyMDEzMyIsImFjY2Vzc0NvZGUiOiJzQVdUdVIiLCJjbGllbnRJRCI6ImZhMDBkMzUyLWM0ZmYtNDQ0Ny04MDAyLWExMzlmMmRiNjMzOSIsImNsaWVudFNlY3JldCI6IlZocGdwZnNrQ2NHWnZRd3QifQ.H-jxKA4I8sjTzVw9oPmtIb5vQaB6SFyHiZABu2VsE44";

export async function recordLog(area, severity, module, details) {
  try {
    const reply = await fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        stack: area,
        level: severity,
        package: module,
        message: details
      }),
    });
    const result = await reply.json();
    window && window.console && window.console.info('Log sent:', result);
  } catch (err) {
    window && window.console && window.console.warn('Log failed:', err);
  }
};