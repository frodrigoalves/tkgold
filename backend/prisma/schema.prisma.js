// backend/prisma/schema.prisma
// Este é o arquivo de esquema do Prisma.
// Aprenda mais sobre ele aqui: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  kyc       KYC?
  sessions  Session[]
  wallet    Wallet? // Adicionado: Relacionamento com o modelo Wallet
  defi      DeFi?   // Adicionado: Relacionamento com o modelo DeFi
}

model KYC {
  id            Int      @id @default(autoincrement())
  userId        Int      @unique
  user          User     @relation(fields: [userId], references: [id])
  documentType  String?
  documentValue String?
  selfieUrl     String?
  status        String   @default("pending") // "pending", "approved", "rejected"
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Session {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  token     String   @unique
  createdAt DateTime @default(now())
  expiresAt DateTime
}

// Novo modelo: Wallet para saldos de USD e GOLD
model Wallet {
  id          Int      @id @default(autoincrement())
  userId      Int      @unique
  user        User     @relation(fields: [userId], references: [id])
  balanceUSD  Float    @default(0)
  balanceGOLD Float    @default(0)
  stakedGOLD  Float    @default(0) // Para GOLD stakado em DeFi
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Novo modelo: DeFi para informações de empréstimo/staking
model DeFi {
  id          Int      @id @default(autoincrement())
  userId      Int      @unique
  user        User     @relation(fields: [userId], references: [id])
  currentLoan Json?    // Armazena detalhes do empréstimo como JSON (amount, currency, collateral, status, etc.)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
