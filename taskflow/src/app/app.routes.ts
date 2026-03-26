import { Routes } from "@angular/router";
import { DashboardComponent } from "./main-panel/pages/dashboard/dashboard.component";
import { LoanComponent } from "./main-panel/pages/loan/loan.component";
import { TransferComponent } from "./main-panel/pages/transfer/transfer.component";
import { TransactionsComponent } from "./main-panel/pages/transactions/transactions.component";
import { CreateTransactionComponent } from "./main-panel/pages/transactions/components/create-transaction/create-transaction.component";
import { NotFoundComponent } from "./main-panel/pages/not-found/not-found.component";
import { ProfileComponent } from "./main-panel/pages/profile/profile.component";
import { PersonalDataComponent } from "./main-panel/pages/profile/personal-data/personal-data.component";
import { SecurityDataComponent } from "./main-panel/pages/profile/security-data/security-data.component";

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'transferencia', component: TransferComponent},
    {path: 'emprestimo', component: LoanComponent},
    {path: 'transacoes', component: TransactionsComponent},
    {path: 'transacoes/criar', component: CreateTransactionComponent},
    {path: 'transacoes/editar/:id', component: CreateTransactionComponent},
    {
        path:'perfil', component: ProfileComponent, children: [
            {path: 'dados', component: PersonalDataComponent},
            {path: 'seguranca', component: SecurityDataComponent},
            {path: '', redirectTo: 'dados', pathMatch: 'full'}
        ]
    },
    {path: '', redirectTo:'/dashboard', pathMatch: 'full'},
    {path: '**', component: NotFoundComponent}

]