export interface Bueiro {
  id: number;
  codigo: string;
  localizacao: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  ultimaManutencao: string;
  latitude: number;
  longitude: number;
  nivelAgua: number;
  temperatura: number;
  umidade: number;
  pressao: number;
}

export interface Alerta {
  id: number;
  bueiroId: number;
  bueiroCodigo: string;
  tipo: string;
  descricao: string;
  data: string;
  status: 'pendente' | 'resolvido' | 'falso-positivo';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
}

export interface Manutencao {
  id: number;
  bueiroId: number;
  bueiroCodigo: string;
  tipo: string;
  descricao: string;
  dataAgendada: string;
  dataRealizada?: string;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
  tecnico: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'admin' | 'tecnico' | 'operador';
  ativo: boolean;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
} 