// Email templates for different notification types

export const emailTemplates = {
  appointmentCreated: {
    client: {
      subject: "Agendamento Confirmado",
      content: (appointment: any) => `
        <h2>Seu agendamento foi confirmado!</h2>
        <p>Olá ${appointment.clientName},</p>
        <p>Seu agendamento para ${appointment.service} foi confirmado para ${appointment.date} às ${appointment.time}.</p>
        <p>Detalhes do agendamento:</p>
        <ul>
          <li><strong>Serviço:</strong> ${appointment.service}</li>
          <li><strong>Data:</strong> ${appointment.date}</li>
          <li><strong>Horário:</strong> ${appointment.time}</li>
          <li><strong>Profissional:</strong> ${appointment.providerName}</li>
        </ul>
        <p>Se precisar reagendar ou cancelar, entre em contato conosco.</p>
        <p>Atenciosamente,<br>Equipe AppointEase</p>
      `,
    },
    provider: {
      subject: "Novo Agendamento",
      content: (appointment: any) => `
        <h2>Novo agendamento realizado!</h2>
        <p>Olá ${appointment.providerName},</p>
        <p>Um novo agendamento foi realizado para ${appointment.date} às ${appointment.time}.</p>
        <p>Detalhes do agendamento:</p>
        <ul>
          <li><strong>Cliente:</strong> ${appointment.clientName}</li>
          <li><strong>Serviço:</strong> ${appointment.service}</li>
          <li><strong>Data:</strong> ${appointment.date}</li>
          <li><strong>Horário:</strong> ${appointment.time}</li>
        </ul>
        <p>Acesse o painel para mais detalhes.</p>
        <p>Atenciosamente,<br>Equipe AppointEase</p>
      `,
    },
  },

  appointmentUpdated: {
    client: {
      subject: "Agendamento Atualizado",
      content: (appointment: any) => `
        <h2>Seu agendamento foi atualizado!</h2>
        <p>Olá ${appointment.clientName},</p>
        <p>Seu agendamento para ${appointment.service} foi atualizado para ${appointment.date} às ${appointment.time}.</p>
        <p>Detalhes atualizados:</p>
        <ul>
          <li><strong>Serviço:</strong> ${appointment.service}</li>
          <li><strong>Data:</strong> ${appointment.date}</li>
          <li><strong>Horário:</strong> ${appointment.time}</li>
          <li><strong>Profissional:</strong> ${appointment.providerName}</li>
        </ul>
        <p>Se precisar reagendar ou cancelar, entre em contato conosco.</p>
        <p>Atenciosamente,<br>Equipe AppointEase</p>
      `,
    },
    provider: {
      subject: "Agendamento Atualizado",
      content: (appointment: any) => `
        <h2>Agendamento atualizado!</h2>
        <p>Olá ${appointment.providerName},</p>
        <p>Um agendamento foi atualizado para ${appointment.date} às ${appointment.time}.</p>
        <p>Detalhes atualizados:</p>
        <ul>
          <li><strong>Cliente:</strong> ${appointment.clientName}</li>
          <li><strong>Serviço:</strong> ${appointment.service}</li>
          <li><strong>Data:</strong> ${appointment.date}</li>
          <li><strong>Horário:</strong> ${appointment.time}</li>
        </ul>
        <p>Acesse o painel para mais detalhes.</p>
        <p>Atenciosamente,<br>Equipe AppointEase</p>
      `,
    },
  },

  appointmentCanceled: {
    client: {
      subject: "Agendamento Cancelado",
      content: (appointment: any) => `
        <h2>Seu agendamento foi cancelado</h2>
        <p>Olá ${appointment.clientName},</p>
        <p>Seu agendamento para ${appointment.service} em ${appointment.date} às ${appointment.time} foi cancelado.</p>
        <p>Se desejar reagendar, entre em contato conosco ou acesse nosso site.</p>
        <p>Atenciosamente,<br>Equipe AppointEase</p>
      `,
    },
    provider: {
      subject: "Agendamento Cancelado",
      content: (appointment: any) => `
        <h2>Agendamento cancelado</h2>
        <p>Olá ${appointment.providerName},</p>
        <p>Um agendamento foi cancelado para ${appointment.date} às ${appointment.time}.</p>
        <p>Detalhes do agendamento cancelado:</p>
        <ul>
          <li><strong>Cliente:</strong> ${appointment.clientName}</li>
          <li><strong>Serviço:</strong> ${appointment.service}</li>
          <li><strong>Data:</strong> ${appointment.date}</li>
          <li><strong>Horário:</strong> ${appointment.time}</li>
        </ul>
        <p>Acesse o painel para mais detalhes.</p>
        <p>Atenciosamente,<br>Equipe AppointEase</p>
      `,
    },
  },

  appointmentReminder: {
    client: {
      subject: "Lembrete de Agendamento",
      content: (appointment: any) => `
        <h2>Lembrete de agendamento</h2>
        <p>Olá ${appointment.clientName},</p>
        <p>Este é um lembrete para seu agendamento de ${appointment.service} amanhã, ${appointment.date} às ${appointment.time}.</p>
        <p>Detalhes do agendamento:</p>
        <ul>
          <li><strong>Serviço:</strong> ${appointment.service}</li>
          <li><strong>Data:</strong> ${appointment.date}</li>
          <li><strong>Horário:</strong> ${appointment.time}</li>
          <li><strong>Profissional:</strong> ${appointment.providerName}</li>
        </ul>
        <p>Se precisar reagendar ou cancelar, entre em contato conosco o mais rápido possível.</p>
        <p>Atenciosamente,<br>Equipe AppointEase</p>
      `,
    },
    provider: {
      subject: "Lembrete de Agendamento",
      content: (appointment: any) => `
        <h2>Lembrete de agendamento</h2>
        <p>Olá ${appointment.providerName},</p>
        <p>Este é um lembrete para um agendamento amanhã, ${appointment.date} às ${appointment.time}.</p>
        <p>Detalhes do agendamento:</p>
        <ul>
          <li><strong>Cliente:</strong> ${appointment.clientName}</li>
          <li><strong>Serviço:</strong> ${appointment.service}</li>
          <li><strong>Data:</strong> ${appointment.date}</li>
          <li><strong>Horário:</strong> ${appointment.time}</li>
        </ul>
        <p>Acesse o painel para mais detalhes.</p>
        <p>Atenciosamente,<br>Equipe AppointEase</p>
      `,
    },
  },

  appointmentConfirmed: {
    client: {
      subject: "Agendamento Confirmado",
      content: (appointment: any) => `
        <h2>Seu agendamento foi confirmado!</h2>
        <p>Olá ${appointment.clientName},</p>
        <p>Seu agendamento para ${appointment.service} em ${appointment.date} às ${appointment.time} foi confirmado pelo prestador de serviço.</p>
        <p>Detalhes do agendamento:</p>
        <ul>
          <li><strong>Serviço:</strong> ${appointment.service}</li>
          <li><strong>Data:</strong> ${appointment.date}</li>
          <li><strong>Horário:</strong> ${appointment.time}</li>
          <li><strong>Profissional:</strong> ${appointment.providerName}</li>
        </ul>
        <p>Se precisar reagendar ou cancelar, entre em contato conosco.</p>
        <p>Atenciosamente,<br>Equipe AppointEase</p>
      `,
    },
    provider: {
      subject: "Agendamento Confirmado",
      content: (appointment: any) => `
        <h2>Agendamento confirmado</h2>
        <p>Olá ${appointment.providerName},</p>
        <p>Você confirmou um agendamento para ${appointment.date} às ${appointment.time}.</p>
        <p>Detalhes do agendamento:</p>
        <ul>
          <li><strong>Cliente:</strong> ${appointment.clientName}</li>
          <li><strong>Serviço:</strong> ${appointment.service}</li>
          <li><strong>Data:</strong> ${appointment.date}</li>
          <li><strong>Horário:</strong> ${appointment.time}</li>
        </ul>
        <p>Acesse o painel para mais detalhes.</p>
        <p>Atenciosamente,<br>Equipe AppointEase</p>
      `,
    },
  },
};
