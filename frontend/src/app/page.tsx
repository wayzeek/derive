import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="mb-4">Dérive Music Metadata Platform</h1>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          Bridging music distributors and Story Protocol to create a unified source of truth for music rights and ownership
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our Daydreams AI agent processes and normalizes metadata from various distributors to ensure consistency and completeness.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost">Learn More</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Register your music rights on Story Protocol's blockchain for transparent and verifiable ownership records.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost">Learn More</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rights Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Comprehensive rights management including moral rights, mechanical rights, and neighboring rights all in one platform.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost">Learn More</Button>
          </CardFooter>
        </Card>
      </div>

      <section className="mb-12 bg-white p-8 rounded-lg shadow">
        <h2 className="mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-derive-purple text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="text-lg font-semibold mb-2">Submit</h3>
            <p className="text-sm">Upload or connect your distributor metadata</p>
          </div>
          
          <div className="text-center">
            <div className="bg-derive-purple text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="text-lg font-semibold mb-2">Process</h3>
            <p className="text-sm">AI agent normalizes and enhances your data</p>
          </div>
          
          <div className="text-center">
            <div className="bg-derive-purple text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="text-lg font-semibold mb-2">Register</h3>
            <p className="text-sm">Submit to Story Protocol blockchain</p>
          </div>
          
          <div className="text-center">
            <div className="bg-derive-purple text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">4</div>
            <h3 className="text-lg font-semibold mb-2">Monitor</h3>
            <p className="text-sm">Track rights and royalties in real-time</p>
          </div>
        </div>
      </section>

      <div className="text-center">
        <h2 className="mb-6">Ready to get started?</h2>
        <Button variant="primary" size="lg">
          Sign Up Now
        </Button>
      </div>
    </main>
  )
}
