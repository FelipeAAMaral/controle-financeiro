
// Service para gerenciar a verificação periódica das reservas

// Tempo em milissegundos entre cada verificação (30 minutos)
const POLL_INTERVAL = 30 * 60 * 1000;

interface ReservaInfo {
  codigoReserva: string;
  sobrenome: string;
  lastChecked: string;
  viagemId: string;
}

// Iniciar o polling para todas as reservas salvas
export function iniciarPollingReservas(callback: (voos: any[], viagemId: string) => void) {
  // Verificar imediatamente
  verificarTodasReservas(callback);
  
  // Configurar verificação periódica
  const intervalId = setInterval(() => {
    verificarTodasReservas(callback);
  }, POLL_INTERVAL);
  
  return () => clearInterval(intervalId);
}

// Verificar todas as reservas salvas
function verificarTodasReservas(callback: (voos: any[], viagemId: string) => void) {
  // Obter todas as chaves do localStorage que começam com "reserva_"
  const reservasKeys = Object.keys(localStorage).filter(key => key.startsWith('reserva_'));
  
  // Para cada reserva, verificar se há atualizações
  reservasKeys.forEach(key => {
    try {
      const reservaInfo: ReservaInfo = JSON.parse(localStorage.getItem(key) || '');
      verificarReserva(reservaInfo, callback);
    } catch (error) {
      console.error(`Erro ao processar reserva ${key}:`, error);
    }
  });
}

// Verificar uma reserva específica
async function verificarReserva(
  reservaInfo: ReservaInfo, 
  callback: (voos: any[], viagemId: string) => void
) {
  try {
    // Em um app real, aqui faria uma chamada à API para verificar atualizações
    // Simulando uma verificação com 10% de chance de haver uma atualização
    const temAtualizacao = Math.random() < 0.1;
    
    if (temAtualizacao) {
      console.log(`Atualização encontrada para reserva ${reservaInfo.codigoReserva}`);
      
      // Simular novos dados de voo
      const voosAtualizados = [
        {
          id: `v${Math.random().toString(36).substr(2, 9)}`,
          viagemId: reservaInfo.viagemId,
          origem: "São Paulo",
          codigoOrigem: "GRU",
          destino: "Paris",
          codigoDestino: "CDG",
          data: "2023-12-01",
          horarioPartida: "23:15", // Horário atualizado
          horarioChegada: "15:30", // Horário atualizado
          companhia: "Air France",
          numeroVoo: "AF457",
          terminal: "3",
          portao: "24", // Portão atualizado
          status: "Confirmado",
          duracao: "11h 15m",
          escalas: [
            {
              aeroporto: "Lisboa",
              codigo: "LIS",
              chegada: "09:00", // Horário atualizado
              partida: "10:15", // Horário atualizado
              terminal: "1",
              portao: "18"
            }
          ]
        }
      ];
      
      // Atualizar timestamp da última verificação
      reservaInfo.lastChecked = new Date().toISOString();
      localStorage.setItem(`reserva_${reservaInfo.codigoReserva}`, JSON.stringify(reservaInfo));
      
      // Chamar o callback com os voos atualizados
      callback(voosAtualizados, reservaInfo.viagemId);
    }
  } catch (error) {
    console.error(`Erro ao verificar reserva ${reservaInfo.codigoReserva}:`, error);
  }
}

// Remover uma reserva do polling
export function removerReserva(codigoReserva: string) {
  localStorage.removeItem(`reserva_${codigoReserva}`);
}

// Listar todas as reservas salvas
export function listarReservas(): ReservaInfo[] {
  const reservasKeys = Object.keys(localStorage).filter(key => key.startsWith('reserva_'));
  
  return reservasKeys.map(key => {
    try {
      return JSON.parse(localStorage.getItem(key) || '');
    } catch (error) {
      console.error(`Erro ao processar reserva ${key}:`, error);
      return null;
    }
  }).filter(Boolean) as ReservaInfo[];
}
