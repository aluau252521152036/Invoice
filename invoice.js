import { useState, useEffect } from 'react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "/components/ui/card"
import { Input } from "/components/ui/input"
import { Label } from "/components/ui/label"
import { Textarea } from "/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Lock, User, Plus, ArrowRight, Home, List } from "lucide-react"

type Invoice = {
  id: number
  invoiceNumber: string
  clientName: string
  date: string
  amount: number
  status: string
}

type Page = 'login' | 'signup' | 'home' | 'invoice-form'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null)
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const storedInvoices = localStorage.getItem('invoices')
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])

  const handleLogin = () => {
    // Simple login logic (for MVP, no real authentication)
    setCurrentPage('home')
  }

  const handleSignup = () => {
    // Simple signup logic (for MVP, no real authentication)
    setCurrentPage('home')
  }

  const handleAddInvoice = () => {
    const newInvoice: Invoice = {
      id: invoices.length + 1,
      invoiceNumber,
      clientName,
      date,
      amount: parseFloat(amount),
      status,
    }
    setInvoices([...invoices, newInvoice])
    setCurrentPage('home')
    setInvoiceNumber('')
    setClientName('')
    setDate('')
    setAmount('')
    setStatus('')
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice)
    setCurrentPage('invoice-form')
    setInvoiceNumber(invoice.invoiceNumber)
    setClientName(invoice.clientName)
    setDate(invoice.date)
    setAmount(invoice.amount.toString())
    setStatus(invoice.status)
  }

  const handleUpdateInvoice = () => {
    if (currentInvoice) {
      const updatedInvoices = invoices.map((invoice) =>
        invoice.id === currentInvoice.id
          ? {
              ...invoice,
              invoiceNumber,
              clientName,
              date,
              amount: parseFloat(amount),
              status,
            }
          : invoice
      )
      setInvoices(updatedInvoices)
      setCurrentPage('home')
      setCurrentInvoice(null)
      setInvoiceNumber('')
      setClientName('')
      setDate('')
      setAmount('')
      setStatus('')
    }
  }

  const handleDeleteInvoice = (id: number) => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== id)
    setInvoices(updatedInvoices)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      {currentPage === 'login' && (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleLogin}>Login</Button>
            <Button variant="secondary" onClick={() => setCurrentPage('signup')}>
              Sign Up
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentPage === 'signup' && (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleSignup}>Sign Up</Button>
            <Button variant="secondary" onClick={() => setCurrentPage('login')}>
              Login
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentPage === 'home' && (
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Invoices</h2>
            <Button onClick={() => setCurrentPage('invoice-form')} variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Invoice
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader>
                  <CardTitle>{invoice.invoiceNumber}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Client: {invoice.clientName}</p>
                  <p className="text-muted-foreground">Date: {invoice.date}</p>
                  <p className="text-muted-foreground">Amount: ${invoice.amount}</p>
                  <p className="text-muted-foreground">Status: {invoice.status}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => handleEditInvoice(invoice)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteInvoice(invoice.id)}>
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentPage === 'invoice-form' && (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{currentInvoice ? 'Edit Invoice' : 'Add Invoice'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input id="invoice-number" type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name</Label>
                <Input id="client-name" type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => setCurrentPage('home')} variant="secondary">
              Cancel
            </Button>
            <Button onClick={currentInvoice ? handleUpdateInvoice : handleAddInvoice}>
              {currentInvoice ? 'Update Invoice' : 'Add Invoice'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
