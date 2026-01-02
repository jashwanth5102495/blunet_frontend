import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { askLLM } from '../services/llm';
import { Paperclip, Mic, Send } from 'lucide-react';

// Module/Topic structure for Networking - Beginner
interface TopicPage {
  id: string;
  title: string;
  theoryPages: string[]; // raw HTML / markdown-like strings
}

interface ModuleData {
  id: string; // e.g. 'module-1'
  title: string;
  topics: TopicPage[];
}

const MODULES: ModuleData[] = [
  {
    id: 'module-1',
    title: 'Networking Fundamentals',
    topics: [
      {
        id: 'osi-model',
        title: 'OSI Model (All 7 Layers)',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Short overview / elevator pitch</h2>
          <p class="mb-4">The OSI (Open Systems Interconnection) model is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven abstract layers. It was created so vendors, developers and network engineers could design interoperable systems and reason about the roles of protocols and devices at each functional level. The model itself does not implement protocols â€” it describes what each layer should do, not how.</p>

          <h3 class="text-lg font-semibold mb-2">History â€” when it was introduced</h3>
          <p class="mb-4">The OSI reference model was standardized by ISO as ISO/IEC 7498 in 1984 (work began in late 1970s/early 1980s within ISO and CCITT). It was created to provide a universal reference that vendors and standards bodies could use to describe network functions and to help guide the development of interoperable network protocols and equipment.</p>

          <h3 class="text-lg font-semibold mb-2">Purpose & primary uses</h3>
          <p class="mb-2"><strong>Purpose:</strong> provide a clear, modular vocabulary and layering structure for designing, building and troubleshooting networks. Each layer has defined services, interfaces and responsibilities.</p>
          <p class="mb-4"><strong>Primary uses:</strong> protocol design, teaching and documentation, troubleshooting (helps locate faults to a specific layer), vendor-agnostic communication about network functions, and mapping real protocols to conceptual responsibilities.</p>

          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>Modularity & separation of concerns: each layer focuses on a small set of tasks, simplifying design and debugging.</li>
            <li>Interoperability: vendors can implement devices/protocols for a single layer while still working with other vendorsâ€™ implementations.</li>
            <li>Education: excellent teaching tool â€” lets students reason about where problems occur.</li>
            <li>Flexibility: layers can be changed or replaced independently (in principle).</li>
            <li>Standardized vocabulary: common language for engineers.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Disadvantages / criticisms</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>Overly theoretical: the OSI model is conceptual â€” many real-world stacks (notably TCP/IP) donâ€™t map one-to-one to all seven layers.</li>
            <li>Complexity in practice: some functions span layers or donâ€™t neatly fit (e.g., NAT mixes roles).</li>
            <li>Slow adoption as a strict implementation guide: protocol developers tended to follow TCP/IP practice rather than strictly implement OSI protocols.</li>
            <li>Potential to confuse beginners when they try to map every detail of a real protocol stack directly to one layer.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <p class="mb-2"><strong>TCP/IP (Internet) model:</strong> the practical, de-facto architecture used on the Internet. Fewer layers (commonly 4 layers: Link, Internet, Transport, Application) and directly tied to working protocols (IP, TCP, UDP, etc.).</p>
          <p class="mb-4"><strong>Hybrid or vendor-specific models:</strong> many vendors use variations or simplified models for their documentation.</p>
          <p class="mb-4">The OSI model is still extremely useful as a teaching and troubleshooting tool even when TCP/IP is used for implementation.</p>

          <h3 class="text-lg font-semibold mb-2">How networking would be without a reference model</h3>
          <p class="mb-2">Without a standard reference model like OSI:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Vendors would describe features differently â€” interoperability would be harder.</li>
            <li>Troubleshooting would be more ad-hoc and slower because engineers wouldnâ€™t have a shared mental model for isolating faults.</li>
            <li>Designing new protocols would be more error-prone: teams would lack a clean decomposition of responsibilities.</li>
          </ul>
          <p class="mb-2">In short: progress would be slower, compatibility issues more frequent, and education/handoffs would be more confusing.</p>
          `,
          `
          <h2 class="text-xl font-semibold mb-3">The 7 Layers â€” continued</h2>
          <p class="mb-4">Purpose, what they do, typical protocols/devices, and minimal use.</p>

          <h2 class="text-xl font-semibold mb-3">OSI Model Diagram & Layers 7â€“6 (plus recap)</h2>
          <p class="mb-3">Visualizing the model helps remember data flow from apps down to physical links.</p>

          <h3 class="text-lg font-semibold mb-2">7ï¸âƒ£ Application Layer</h3>
          <p class="mb-2"><strong>Purpose:</strong> Provides network services directly to users and applications.</p>
          <ul class="list-disc pl-6 mb-3">
            <li>Browsers use HTTP/HTTPS</li>
            <li>Email uses SMTP/IMAP</li>
            <li>File transfer uses FTP</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">6ï¸âƒ£ Presentation Layer</h3>
          <p class="mb-2"><strong>Purpose:</strong> Ensures data is in a readable format for applications.</p>
          <ul class="list-disc pl-6 mb-3">
            <li>Encryption/Decryption (SSL/TLS)</li>
            <li>Compression</li>
            <li>Data format translation (JPEG, PNG, ASCII, UTF-8)</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">5ï¸âƒ£ Session Layer</h3>
          <p class="mb-2"><strong>Purpose:</strong> Creates, manages, and ends sessions between two devices.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Manages login sessions</li>
            <li>Maintains active communication</li>
            <li>Controls session timeout</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">4ï¸âƒ£ Transport Layer</h3>
          <p class="mb-2"><strong>Purpose:</strong> Ensures reliable or fast delivery of data between applications using TCP or UDP.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>TCP: reliability, retransmission</li>
            <li>UDP: fast, real-time transfer</li>
            <li>Breaks data into segments</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">3ï¸âƒ£ Network Layer</h3>
          <p class="mb-2"><strong>Purpose:</strong> Handles routing and logical addressing (IP addresses) to send data across different networks.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Finds the best path to destination</li>
            <li>Manages IP addressing (IPv4/IPv6)</li>
            <li>Routers work at this layer</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">2ï¸âƒ£ Data Link Layer</h3>
          <p class="mb-2"><strong>Purpose:</strong> Provides error detection, framing, and MAC addressing for reliability between directly connected devices.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Uses MAC address to deliver frame within the same network</li>
            <li>Detects and corrects errors</li>
            <li>Divides data into frames</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">1ï¸âƒ£ Physical Layer</h3>
          <p class="mb-2"><strong>Purpose:</strong> Handles the physical transmission of raw bits (0s and 1s) over cables or wireless signals.</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Defines cable types (Ethernet, Fiber)</li>
            <li>Voltage, frequency, data rates</li>
            <li>Converts digital data to electrical/light/radio signals</li>
          </ul>

          <div class="mt-6 p-4 rounded-lg border">
            <p class="mb-2"><strong>Tip:</strong> Try mapping real tools (curl, openssl, ping) to layers.</p>
          </div>
          `
        ]
      },
      {
        id: 'tcpip-model',
        title: 'TCP/IP Model â€“ 4 Layers',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">What is the TCP/IP Model?</h2>
          <p class="mb-3">The TCP/IP Model (Transmission Control Protocol / Internet Protocol) is a 4-layer networking model developed by the U.S. Department of Defense (DoD) in the 1970s to ensure reliable communication even under extreme conditions.</p>
          <p class="mb-3">It is the foundation of the modern Internet and defines how data travels from one device to another across networks.</p>

          <h3 class="text-lg font-semibold mb-2">Purpose of the TCP/IP Model</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>Enable communication between different types of networks</li>
            <li>Allow millions of computers to connect globally</li>
            <li>Provide reliable and scalable communication</li>
            <li>Standardize networking for the Internet</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Why TCP/IP Was Introduced</h3>
          <p class="mb-2">Before TCP/IP, computers used different, incompatible networking systems. TCP/IP solved this by providing one universal protocol stack that all devices can follow.</p>

          <h3 class="text-lg font-semibold mb-2">TCP/IP Model â€“ 4 Layers (Purpose & Use)</h3>
          <h4 class="text-base font-semibold mb-1">1ï¸âƒ£ Network Interface Layer (Link Layer)</h4>
          <p class="mb-1"><strong>Purpose:</strong> Handles physical transmission and works within the local network.</p>
          <ul class="list-disc pl-6 mb-3">
            <li>Deals with MAC addressing</li>
            <li>Responsible for frames, error detection</li>
            <li>Works with Ethernet, Wiâ€‘Fi, ARP</li>
          </ul>

          <h4 class="text-base font-semibold mb-1">2ï¸âƒ£ Internet Layer</h4>
          <p class="mb-1"><strong>Purpose:</strong> Handles logical addressing (IP) and routing packets across multiple networks.</p>
          <ul class="list-disc pl-6 mb-3">
            <li>Assigns IP addresses (IPv4 & IPv6)</li>
            <li>Forwards packets through routers</li>
            <li>Uses protocols like IP, ICMP, ARP</li>
            <li>Finds the best path to destination</li>
          </ul>

          <h4 class="text-base font-semibold mb-1">3ï¸âƒ£ Transport Layer</h4>
          <p class="mb-1"><strong>Purpose:</strong> Ensures endâ€‘toâ€‘end communication between applications using TCP or UDP.</p>
          <ul class="list-disc pl-6 mb-3">
            <li>TCP â†’ Reliable, connectionâ€‘oriented</li>
            <li>UDP â†’ Fast, connectionless</li>
            <li>Manages ports</li>
            <li>Breaks data into segments</li>
          </ul>

          <h4 class="text-base font-semibold mb-1">4ï¸âƒ£ Application Layer</h4>
          <p class="mb-1"><strong>Purpose:</strong> Provides services directly to user applications over the network.</p>
          <ul class="list-disc pl-6 mb-3">
            <li>Web browsing â†’ HTTP/HTTPS</li>
            <li>Emails â†’ SMTP, IMAP</li>
            <li>File sharing â†’ FTP</li>
            <li>Name resolution â†’ DNS</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Why TCP/IP Is Important</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>The actual model used on the Internet</li>
            <li>Simple and practical</li>
            <li>Works across all devices & platforms</li>
            <li>Scalable for millions of networks</li>
            <li>Supports modern communication protocols</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">What If TCP/IP Didnâ€™t Exist?</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>No standard method for global communication</li>
            <li>Devices from different vendors wouldnâ€™t connect</li>
            <li>Email, browsing, apps wouldnâ€™t work reliably</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Alternatives to TCP/IP</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>OSI Model (theoretical 7â€‘layer model)</li>
            <li>AppleTalk (discontinued)</li>
            <li>IPX/SPX (Novell, discontinued)</li>
            <li>Today TCP/IP is the global standard</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">OSI vs TCP/IP (Short Comparison)</h3>
          <table class="min-w-full border rounded-lg mb-4">
            <thead>
              <tr>
                <th class="text-left p-2 border">Feature</th>
                <th class="text-left p-2 border">OSI Model</th>
                <th class="text-left p-2 border">TCP/IP Model</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-2 border">Layers</td>
                <td class="p-2 border">7</td>
                <td class="p-2 border">4</td>
              </tr>
              <tr>
                <td class="p-2 border">Usage</td>
                <td class="p-2 border">Reference model</td>
                <td class="p-2 border">Realâ€‘world Internet</td>
              </tr>
              <tr>
                <td class="p-2 border">Developed by</td>
                <td class="p-2 border">ISO</td>
                <td class="p-2 border">DoD</td>
              </tr>
              <tr>
                <td class="p-2 border">Flexibility</td>
                <td class="p-2 border">Detailed but complex</td>
                <td class="p-2 border">Simple & practical</td>
              </tr>
            </tbody>
          </table>

          <div class="mt-4 p-3 rounded-lg border">
            <p class="text-sm opacity-80 mb-1"><strong>Try it:</strong> Map common tools to layers (e.g., <code>ip addr</code> â†’ Internet layer, <code>netstat</code> â†’ Transport).</p>
          </div>
          `
        ]
      },
      {
        id: 'tcpip-ip-addressing',
        title: 'TCP/IP Model & IP Addressing (IPv4 & IPv6)',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">What is an IP Address?</h2>
          <p class="mb-3">An IP Address (Internet Protocol Address) is a unique identifier assigned to each device on a network, like a house address so data knows where to go.</p>
          <p class="mb-3">IP addressing is managed by the Internet Protocol. IPv4 was introduced in the early 1980s and IPv6 was created later to support Internet growth.</p>

          <h3 class="text-lg font-semibold mb-2">Why IP Addresses Are Needed</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>Uniquely identify devices</li>
            <li>Send and receive data on networks</li>
            <li>Route packets across the Internet</li>
            <li>Prevent address conflicts between devices</li>
          </ul>
          <p class="mb-4">Without IP addressing, communication between networks would be impossible.</p>

          <h3 class="text-lg font-semibold mb-2">Two Main Versions</h3>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>IPv4:</strong> Older, widely used</li>
            <li><strong>IPv6:</strong> Newer, created due to IPv4 exhaustion</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3">IPv4 (Internet Protocol version 4)</h2>
          <h4 class="text-base font-semibold mb-1">Purpose</h4>
          <p class="mb-2">Identify devices using 32-bit numeric addresses.</p>
          <h4 class="text-base font-semibold mb-1">Format</h4>
          <ul class="list-disc pl-6 mb-3">
            <li>32-bit address</li>
            <li>Written in decimal</li>
            <li>4 blocks (octets), e.g., <code>192.168.1.1</code></li>
          </ul>
          <h4 class="text-base font-semibold mb-1">Use</h4>
          <ul class="list-disc pl-6 mb-3">
            <li>LANs, WANs, home networks, companies</li>
            <li>Supported by routers and devices globally</li>
            <li>Still the most popular version</li>
          </ul>
          <h4 class="text-base font-semibold mb-2">Classes of IPv4</h4>
          <table class="min-w-full border rounded-lg mb-3">
            <thead>
              <tr>
                <th class="text-left p-2 border">Class</th>
                <th class="text-left p-2 border">Range</th>
                <th class="text-left p-2 border">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-2 border">A</td>
                <td class="p-2 border">1.0.0.0 â€“ 126.0.0.0</td>
                <td class="p-2 border">Large networks</td>
              </tr>
              <tr>
                <td class="p-2 border">B</td>
                <td class="p-2 border">128.0.0.0 â€“ 191.255.0.0</td>
                <td class="p-2 border">Medium networks</td>
              </tr>
              <tr>
                <td class="p-2 border">C</td>
                <td class="p-2 border">192.0.0.0 â€“ 223.255.255.0</td>
                <td class="p-2 border">Small networks</td>
              </tr>
              <tr>
                <td class="p-2 border">D</td>
                <td class="p-2 border">224.0.0.0 â€“ 239.255.255.255</td>
                <td class="p-2 border">Multicast</td>
              </tr>
              <tr>
                <td class="p-2 border">E</td>
                <td class="p-2 border">240.0.0.0 â€“ 255.255.255.255</td>
                <td class="p-2 border">Research</td>
              </tr>
            </tbody>
          </table>
          <h4 class="text-base font-semibold mb-1">Private IPv4 Ranges</h4>
          <ul class="list-disc pl-6 mb-3">
            <li><code>10.0.0.0 â€“ 10.255.255.255</code></li>
            <li><code>172.16.0.0 â€“ 172.31.255.255</code></li>
            <li><code>192.168.0.0 â€“ 192.168.255.255</code></li>
          </ul>
          <p class="mb-3">Used inside homes, offices, and internal networks.</p>
          <h4 class="text-base font-semibold mb-1">Limitations of IPv4</h4>
          <ul class="list-disc pl-6 mb-4">
            <li>Only ~4.3 billion addresses</li>
            <li>Easy to exhaust â†’ relies on NAT</li>
            <li>No built-in security features</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3">IPv6 (Internet Protocol version 6)</h2>
          <h4 class="text-base font-semibold mb-1">Purpose</h4>
          <p class="mb-2">Created to overcome IPv4 exhaustion and support future Internet growth.</p>
          <h4 class="text-base font-semibold mb-1">Format</h4>
          <ul class="list-disc pl-6 mb-3">
            <li>128-bit address</li>
            <li>Written in hexadecimal</li>
            <li>Example: <code>2001:0db8:85a3:0000:0000:8a2e:0370:7334</code></li>
          </ul>
          <h4 class="text-base font-semibold mb-1">Use</h4>
          <ul class="list-disc pl-6 mb-3">
            <li>Newer Internet systems, ISPs</li>
            <li>IoT devices</li>
            <li>High-speed and mobile networks</li>
          </ul>
          <h4 class="text-base font-semibold mb-1">Benefits of IPv6</h4>
          <ul class="list-disc pl-6 mb-3">
            <li>~3.4Ã—10^38 addresses (wonâ€™t run out)</li>
            <li>No need for NAT</li>
            <li>Built-in IPsec encryption</li>
            <li>Faster routing</li>
            <li>Better for mobile devices</li>
          </ul>
          <h4 class="text-base font-semibold mb-1">Shortening IPv6</h4>
          <ul class="list-disc pl-6 mb-3">
            <li>Remove leading zeros</li>
            <li>Replace one long run of zeros with <code>::</code> (only once)</li>
          </ul>
          <p class="mb-3">Example long: <code>2001:0db8:0000:0000:0000:0000:1428:57ab</code><br/>Short: <code>2001:db8::1428:57ab</code></p>

          <h3 class="text-lg font-semibold mb-2">If IP Addressing Did Not Exist</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>No device could send data</li>
            <li>No Internet or communication</li>
            <li>Routers cannot identify destinations</li>
            <li>Websites, apps, email â†’ impossible</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Alternatives / Supporting Systems</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>MAC addresses (local network only)</li>
            <li>Hostnames & DNS (human-friendly names mapped to IPs)</li>
          </ul>
          <p class="mb-2">IP addressing remains mandatory for all networking.</p>
          `
        ]
      },
      {
        id: 'tcp-vs-udp',
        title: 'TCP vs UDP',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">What is TCP? (Transmission Control Protocol)</h2>
          <p class="mb-3">TCP is a connection-oriented communication protocol created in the early 1980s as part of the original internet design (ARPANET â†’ TCP/IP). It ensures that data is delivered reliably, accurately, and in the correct order. Before sending data, it creates a virtual connection between devices using the 3-way handshake.</p>

          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Provide reliable communication</li>
            <li>Detect and correct errors</li>
            <li>Reorder packets if they arrive in the wrong sequence</li>
            <li>Ensure that no data is lost during transmission</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">How It Works</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Sender and receiver establish a connection</li>
            <li>Data is broken into segments and sent</li>
            <li>Receiver acknowledges every successful segment</li>
            <li>If a packet is lost, TCP resends it</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Where Itâ€™s Used</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Browsing the internet (HTTP/HTTPS)</li>
            <li>Email (SMTP)</li>
            <li>Remote login (SSH)</li>
            <li>File transfer (FTP/SFTP)</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Most reliable protocol on the internet</li>
            <li>Ensures error-free communication</li>
            <li>Guarantees data order</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Slower because of extra processes (handshake, acknowledgements)</li>
            <li>High overhead â†’ more CPU & memory usage</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Without TCP?</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Websites would not load correctly</li>
            <li>File downloads would get corrupted</li>
            <li>Emails might not reach properly</li>
            <li>Online banking would be impossible</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>QUIC (used in modern browsers, faster than TCP)</li>
            <li>SCTP (used in telecom)</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3">What is UDP? (User Datagram Protocol)</h2>
          <p class="mb-3">UDP is a connectionless, lightweight protocol created to solve TCPâ€™s speed limitations. It sends data without establishing a connection, meaning no acknowledgements and no resending of lost packets.</p>

          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Provide extremely fast data transmission</li>
            <li>Reduce delay (latency)</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Where Itâ€™s Used</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Live streaming (YouTube Live, sports)</li>
            <li>Online gaming (low latency)</li>
            <li>Voice/video calling (Zoom, VoIP)</li>
            <li>Broadcast messages inside networks</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Very fast, minimal delay</li>
            <li>Simple, low resource usage</li>
            <li>Better for real-time communication</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>No guarantee of delivery</li>
            <li>No packet reordering</li>
            <li>No error correction</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Without UDP?</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Live sports streams would lag constantly</li>
            <li>Online games would feel slow</li>
            <li>Video calls would break frequently</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>QUIC (Googleâ€™s faster protocol)</li>
            <li>RTP (Real-time transport protocol for voice/video)</li>
          </ul>

          <div class="mt-4 p-3 rounded-lg border">
            <h3 class="text-lg font-semibold mb-2">Syntax</h3>
            <p class="mb-2"><strong>TCP handshake:</strong> <code>SYN â†’ SYN-ACK â†’ ACK</code></p>
            <p class="mb-2"><strong>UDP communication:</strong> <code>send(packet_without_connection)</code></p>
          </div>
          `
        ]
      },
      {
        id: 'mac-arp-dns-dhcp',
        title: 'MAC Address, ARP, DNS, DHCP',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">MAC Address</h2>
          <p class="mb-3">A MAC (Media Access Control) Address is a unique 12â€‘digit hexadecimal address permanently assigned to every network device (like your laptop Wiâ€‘Fi card). It was introduced in early Ethernet standards (1980s) to uniquely identify each machine inside a network.</p>
          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Identify devices at the dataâ€‘link layer (Layer 2)</li>
            <li>Enable communication within a local network (LAN)</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Use Cases</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Wireless connectivity (Wiâ€‘Fi)</li>
            <li>Wired connections (Ethernet)</li>
            <li>Device filtering (MAC filtering on routers)</li>
            <li>ARP uses MAC to deliver packets</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Unique to every device</li>
            <li>Required for LAN communication</li>
            <li>Works even if IP addresses change</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Can be spoofed</li>
            <li>Not usable outside LAN</li>
            <li>Not encrypted â†’ visible to others</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Without MAC Address?</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Devices on LAN could not communicate</li>
            <li>Routers and switches would not know where to send frames</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <p class="mb-3">None â€” MAC is mandatory for Ethernet & Wiâ€‘Fi.</p>
          <div class="mt-3 p-3 rounded-lg border">
            <h4 class="text-md font-semibold mb-2">Terminal</h4>
            <p class="mb-1">View MAC address (Windows): <code>ipconfig /all</code></p>
          </div>
          `,
          `
          <h2 class="text-xl font-semibold mt-6 mb-3">ARP (Address Resolution Protocol)</h2>
          <p class="mb-3">ARP was created to help networks map IP Address â†’ MAC Address. Since devices communicate using MAC addresses inside LAN, ARP makes communication possible.</p>
          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Find the MAC address of a device using its IP</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Use Cases</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>LAN communication</li>
            <li>Switching operations</li>
            <li>Sending packets inside office/home networks</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Simple and automatic</li>
            <li>Fast resolution</li>
            <li>Essential for IPv4 networks</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Vulnerable to ARP spoofing attacks</li>
            <li>No authentication</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Without ARP?</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Devices cannot find each other on LAN</li>
            <li>Communication would fail</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <p class="mb-3">NDP (Neighbor Discovery Protocol) for IPv6.</p>
          <div class="mt-3 p-3 rounded-lg border">
            <h4 class="text-md font-semibold mb-2">Terminal</h4>
            <p class="mb-1">See ARP table: <code>arp -a</code></p>
          </div>
          `,
          `
          <h2 class="text-xl font-semibold mt-6 mb-3">DNS (Domain Name System)</h2>
          <p class="mb-3">DNS was introduced in 1983 to replace the old HOSTS.TXT file system. It converts domain names â†’ IP addresses so users donâ€™t have to remember numbers.</p>
          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Make the internet humanâ€‘friendly</li>
            <li>Translate website names into server IP addresses</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Use Cases</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Browsing websites</li>
            <li>Email routing</li>
            <li>Online apps and services</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Easily scalable</li>
            <li>Global distributed system</li>
            <li>Reduces human error</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Attacks like DNS spoofing, DNS hijacking</li>
            <li>Dependency on DNS servers</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Without DNS?</h3>
          <p class="mb-3">You must type <code>142.250.183.206</code> instead of <code>google.com</code>.</p>
          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Hosts file (only for few entries)</li>
            <li>mDNS (local DNS in small networks)</li>
          </ul>
          <div class="mt-3 p-3 rounded-lg border">
            <h4 class="text-md font-semibold mb-2">Terminal</h4>
            <p class="mb-1">DNS lookup: <code>nslookup google.com</code></p>
          </div>
          `,
          `
          <h2 class="text-xl font-semibold mt-6 mb-3">DHCP (Dynamic Host Configuration Protocol)</h2>
          <p class="mb-3">DHCP was created to automate IP configuration in networks. Instead of manually assigning IPs, DHCP gives IP, gateway, DNS automatically.</p>
          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Autoâ€‘assign IP addresses</li>
            <li>Reduce admin workload</li>
            <li>Avoid IP conflicts</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Use Cases</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Home Wiâ€‘Fi</li>
            <li>Office networks</li>
            <li>Large enterprise networks</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Fully automated</li>
            <li>Reduces configuration time</li>
            <li>Prevents duplicate IP issues</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>If DHCP server fails â†’ no devices get IP</li>
            <li>Rogue DHCP attacks possible</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Without DHCP?</h3>
          <p class="mb-3">Admins must manually assign: IP address, Subnet mask, Gateway, DNS â†’ Very timeâ€‘consuming.</p>
          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Static IP</li>
            <li>SLAAC (IPv6 auto IP assignment)</li>
          </ul>
          <div class="mt-3 p-3 rounded-lg border">
            <h4 class="text-md font-semibold mb-2">Terminal</h4>
            <p class="mb-1">Renew IP (Windows): <code>ipconfig /renew</code></p>
          </div>
          `
        ]
      },
      {
        id: 'basic-protocols',
        title: 'Basic Protocols (HTTP, HTTPS, FTP, SMTP)',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">HTTP (Hypertext Transfer Protocol)</h2>
          <p class="mb-3">Introduced in 1991, HTTP is the foundation of all webpages.</p>
          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <p class="mb-3">Transfer web content between client and server.</p>
          <h3 class="text-lg font-semibold mb-2">Use</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Browsing webpages</li>
            <li>API requests</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Fast, simple</li>
            <li>Easy to develop websites</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>No encryption â†’ insecure</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Without HTTP?</h3>
          <p class="mb-3">Web browsing would be extremely complex.</p>
          <h3 class="text-lg font-semibold mb-2">Alternative</h3>
          <p class="mb-4">HTTPS</p>

          <h2 class="text-xl font-semibold mb-3">HTTPS (HTTP Secure)</h2>
          <p class="mb-3">Introduced in 1994 to add security to HTTP.</p>
          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <p class="mb-3">Encrypt communication using SSL/TLS.</p>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Protects passwords & personal data</li>
            <li>Prevents MITM attacks</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Slightly slower due to encryption</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Without HTTPS?</h3>
          <p class="mb-4">Banking, shopping, login pages would be unsafe.</p>

          <h2 class="text-xl font-semibold mb-3">FTP (File Transfer Protocol)</h2>
          <p class="mb-3">Created in 1971, one of the oldest internet protocols.</p>
          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <p class="mb-3">Transfer files between client & server.</p>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Reliable for large files</li>
            <li>Supports authentication</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Plain text â†’ insecure</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6 mb-4">
            <li>SFTP</li>
            <li>SCP</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3">SMTP (Simple Mail Transfer Protocol)</h2>
          <p class="mb-3">Standard emailâ€‘sending protocol since 1982.</p>
          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <p class="mb-3">Transfer emails between mail servers.</p>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Reliable</li>
            <li>Supports attachments & routing</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Needs encryption manually (STARTTLS)</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <p class="mb-4">IMAP/POP3 (for receiving emails)</p>

          <div class="mt-3 p-3 rounded-lg border">
            <h4 class="text-md font-semibold mb-2">Terminal</h4>
            <p class="mb-1">Check HTTP headers: <code>curl -I http://example.com</code></p>
            <p class="mb-1">Check HTTPS: <code>curl -I https://example.com</code></p>
          </div>
          `
        ]
      },
      {
        id: 'topologies-architecture',
        title: 'Network Topologies & Architecture',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">What is Network Topology?</h2>
          <p class="mb-3">Network topology refers to the physical or logical layout of devices (computers, switches, routers) inside a network.</p>
          <ul class="list-disc pl-6 mb-4">
            <li><strong>Physical topology</strong> â†’ the actual cable/device placement</li>
            <li><strong>Logical topology</strong> â†’ how data flows between devices</li>
          </ul>
          <p class="mb-3">Topologies were introduced during early Ethernet development in the 1970sâ€“1980s and are still used in modern networks.</p>
          <p class="mb-4">Understanding topology affects <strong>speed</strong>, <strong>fault tolerance</strong>, <strong>cost</strong>, <strong>maintenance</strong>, and <strong>scalability</strong>.</p>

          <h2 class="text-xl font-semibold mb-3">Types of Network Topologies (Detailed)</h2>

          <h3 class="text-lg font-semibold mb-2">1) Bus Topology</h3>
          <h4 class="font-medium">Definition</h4>
          <p class="mb-2">All devices are connected to a single central cable called the â€œbackbone.â€</p>
          <h4 class="font-medium">Purpose</h4>
          <p class="mb-2">Simple LAN structure; suitable for small temporary networks.</p>
          <h4 class="font-medium">Realâ€‘world Use</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Early Ethernet networks</li>
            <li>Old computer labs</li>
          </ul>
          <h4 class="font-medium">Advantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Easy and cheap to implement</li>
            <li>Requires less cable</li>
            <li>Good for small networks</li>
          </ul>
          <h4 class="font-medium">Disadvantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Backbone cable failure = entire network fails</li>
            <li>Difficult to troubleshoot</li>
            <li>Very slow when many devices communicate</li>
            <li>Not scalable</li>
          </ul>
          <h4 class="font-medium">Without Bus Topology?</h4>
          <p class="mb-4">Early networks would have been more expensive and complicated.</p>

          <h3 class="text-lg font-semibold mb-2">2) Star Topology</h3>
          <h4 class="font-medium">Definition</h4>
          <p class="mb-2">All devices connect to a central switch or hub.</p>
          <h4 class="font-medium">Purpose</h4>
          <p class="mb-2">Improve reliability compared to bus topology.</p>
          <h4 class="font-medium">Realâ€‘world Use</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Home Wiâ€‘Fi networks</li>
            <li>Corporate LANs</li>
          </ul>
          <h4 class="font-medium">Advantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Most reliable topology</li>
            <li>Easy to manage</li>
            <li>Fault in one cable doesnâ€™t affect others</li>
          </ul>
          <h4 class="font-medium">Disadvantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Central switch failure = entire network down</li>
            <li>More cables required</li>
          </ul>
          <h4 class="font-medium">Why It Matters</h4>
          <p class="mb-4">Star topology is the most used topology today.</p>

          <h3 class="text-lg font-semibold mb-2">3) Ring Topology</h3>
          <h4 class="font-medium">Definition</h4>
          <p class="mb-2">Each device is connected in a circular loop.</p>
          <h4 class="font-medium">Purpose</h4>
          <p class="mb-2">Ensures predictable data flow.</p>
          <h4 class="font-medium">Realâ€‘world Use</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Older telecom networks</li>
            <li>Fiberâ€‘based SONET rings</li>
          </ul>
          <h4 class="font-medium">Advantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Equal access for each device</li>
            <li>Good for medium traffic</li>
          </ul>
          <h4 class="font-medium">Disadvantages</h4>
          <ul class="list-disc pl-6 mb-4">
            <li>Failure in any device breaks the loop</li>
            <li>Complex to maintain</li>
            <li>Slow compared to modern topologies</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">4) Mesh Topology</h3>
          <h4 class="font-medium">Definition</h4>
          <p class="mb-2">Every device connects to several or all other devices.</p>
          <h4 class="font-medium">Purpose</h4>
          <p class="mb-2">High reliability for near zeroâ€‘downtime networks.</p>
          <h4 class="font-medium">Realâ€‘world Use</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Military communication</li>
            <li>Disaster recovery systems</li>
            <li>Modern Wiâ€‘Fi mesh routers (home networks)</li>
          </ul>
          <h4 class="font-medium">Advantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Extremely reliable</li>
            <li>Multiple communication paths</li>
            <li>Great for critical networks</li>
          </ul>
          <h4 class="font-medium">Disadvantages</h4>
          <ul class="list-disc pl-6 mb-4">
            <li>Very expensive</li>
            <li>Hard to configure</li>
            <li>High maintenance</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">5) Hybrid Topology</h3>
          <h4 class="font-medium">Definition</h4>
          <p class="mb-2">A combination of two or more topologies (e.g., star + bus).</p>
          <h4 class="font-medium">Purpose</h4>
          <p class="mb-2">To take advantage of multiple topologies.</p>
          <h4 class="font-medium">Use Cases</h4>
          <ul class="list-disc pl-6 mb-4">
            <li>Universities</li>
            <li>Large companies</li>
            <li>Multistory offices</li>
          </ul>

          <h2 class="text-xl font-semibold mb-3">Network Architecture</h2>
          <p class="mb-4">Network architecture defines how data is shared and how systems communicate.</p>

          <h3 class="text-lg font-semibold mb-2">1) Clientâ€“Server Architecture</h3>
          <h4 class="font-medium">Definition</h4>
          <p class="mb-2">Clients request services, and servers provide them.</p>
          <h4 class="font-medium">Purpose</h4>
          <p class="mb-2">Centralized control, secure storage, and easy management.</p>
          <h4 class="font-medium">Realâ€‘world Use</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Banks, hospitals, college labs</li>
            <li>Backends like Google, Facebook, Instagram</li>
          </ul>
          <h4 class="font-medium">Advantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>High security</li>
            <li>Centralized data management</li>
            <li>Easy updates</li>
          </ul>
          <h4 class="font-medium">Disadvantages</h4>
          <ul class="list-disc pl-6 mb-4">
            <li>Server failure = service disruption</li>
            <li>Requires professional administration</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">2) Peerâ€‘toâ€‘Peer (P2P) Architecture</h3>
          <h4 class="font-medium">Definition</h4>
          <p class="mb-2">Each device acts as both client and server.</p>
          <h4 class="font-medium">Purpose</h4>
          <p class="mb-2">Share data without a central server.</p>
          <h4 class="font-medium">Realâ€‘world Use</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Torrents</li>
            <li>Bluetooth file sharing</li>
            <li>Small home networks</li>
          </ul>
          <h4 class="font-medium">Advantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>No server required</li>
            <li>Costâ€‘efficient</li>
            <li>Easy setup</li>
          </ul>
          <h4 class="font-medium">Disadvantages</h4>
          <ul class="list-disc pl-6 mb-4">
            <li>Less secure</li>
            <li>Harder to manage large networks</li>
          </ul>

          <div class="mt-3 p-3 rounded-lg border">
            <h4 class="text-md font-semibold mb-2">Terminal</h4>
            <p class="mb-1">Check active network connections: <code>netstat -an</code></p>
            <p class="mb-1">Trace how a packet travels: <code>tracert google.com</code></p>
          </div>
          `
        ]
      },
      {
        id: 'lan-wan-man-pan',
        title: 'Concept of LAN, WAN, MAN, PAN',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Concepts of LAN, WAN, MAN, PAN</h2>
          <p class="mb-3">These are categories of networks based on geographical coverage and purpose.</p>

          <h3 class="text-lg font-semibold mb-2">LAN â€” Local Area Network</h3>
          <h4 class="font-medium">Definition</h4>
          <p class="mb-2">LAN covers a small geographical area like home, office, school, or lab.</p>
          <p class="mb-2">LAN was introduced in the 1970s with Ethernet technology.</p>
          <h4 class="font-medium">Purpose</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>High-speed local communication</li>
            <li>Shared resources (printers, files, internet)</li>
          </ul>
          <h4 class="font-medium">Characteristics</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Very fast (up to 10 Gbps)</li>
            <li>Private ownership</li>
            <li>Secure and manageable</li>
          </ul>
          <h4 class="font-medium">Advantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>High-speed data transfer</li>
            <li>Low cost</li>
            <li>Easy to maintain</li>
          </ul>
          <h4 class="font-medium">Disadvantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Limited to short distances</li>
            <li>Needs routers to connect to internet</li>
          </ul>
          <h4 class="font-medium">Examples</h4>
          <ul class="list-disc pl-6 mb-4">
            <li>Your home Wiâ€‘Fi</li>
            <li>College computer labs</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">WAN â€” Wide Area Network</h3>
          <h4 class="font-medium">Definition</h4>
          <p class="mb-2">WAN covers large geographical areas: cities, countries, continents.</p>
          <p class="mb-2">The Internet is the biggest WAN. WAN was created by ARPANET in 1969.</p>
          <h4 class="font-medium">Purpose</h4>
          <p class="mb-2">Connect multiple LANs across long distances.</p>
          <h4 class="font-medium">Characteristics</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Lower speed than LAN</li>
            <li>Expensive to maintain</li>
            <li>Uses telecom links (fiber, satellites)</li>
          </ul>
          <h4 class="font-medium">Advantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Connect offices across the world</li>
            <li>Enables global communication</li>
          </ul>
          <h4 class="font-medium">Disadvantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>High cost</li>
            <li>Complex configuration</li>
            <li>Higher latency</li>
          </ul>
          <h4 class="font-medium">Examples</h4>
          <ul class="list-disc pl-6 mb-4">
            <li>ISPs (Airtel, Jio)</li>
            <li>Internet backbone</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">MAN â€” Metropolitan Area Network</h3>
          <h4 class="font-medium">Definition</h4>
          <p class="mb-2">MAN covers an entire city or metropolitan region.</p>
          <h4 class="font-medium">Purpose</h4>
          <p class="mb-2">Connect multiple LANs within a city.</p>
          <h4 class="font-medium">Characteristics</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Larger than LAN</li>
            <li>Smaller than WAN</li>
            <li>Used by ISPs to provide broadband</li>
          </ul>
          <h4 class="font-medium">Advantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>High bandwidth</li>
            <li>Good for cityâ€‘level communication</li>
          </ul>
          <h4 class="font-medium">Disadvantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>More expensive than LAN</li>
            <li>Needs professional management</li>
          </ul>
          <h4 class="font-medium">Examples</h4>
          <ul class="list-disc pl-6 mb-4">
            <li>Cityâ€‘wide cable networks</li>
            <li>Metro Wiâ€‘Fi</li>
            <li>University campuses</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">PAN â€” Personal Area Network</h3>
          <h4 class="font-medium">Definition</h4>
          <p class="mb-2">PAN covers an individualâ€™s personal space (within ~10 meters).</p>
          <h4 class="font-medium">Purpose</h4>
          <p class="mb-2">Connect personal devices.</p>
          <h4 class="font-medium">Examples</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Bluetooth headphones</li>
            <li>Smartwatch connected to mobile</li>
            <li>AirDrop</li>
            <li>Mobile hotspot</li>
          </ul>
          <h4 class="font-medium">Characteristics</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Very small range</li>
            <li>Low power usage</li>
            <li>Designed for portability</li>
          </ul>
          <h4 class="font-medium">Advantages</h4>
          <ul class="list-disc pl-6 mb-2">
            <li>Easy to use</li>
            <li>No need of physical cables</li>
          </ul>
          <h4 class="font-medium">Disadvantages</h4>
          <ul class="list-disc pl-6 mb-4">
            <li>Limited range</li>
            <li>Lower speed</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Difference Summary</h3>
          <div class="overflow-x-auto mb-4">
            <table class="min-w-full border rounded-lg text-sm">
              <thead>
                <tr>
                  <th class="text-left p-2 border">Type</th>
                  <th class="text-left p-2 border">Full Form</th>
                  <th class="text-left p-2 border">Coverage</th>
                  <th class="text-left p-2 border">Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="p-2 border">LAN</td>
                  <td class="p-2 border">Local Area Network</td>
                  <td class="p-2 border">Small area</td>
                  <td class="p-2 border">Home, office</td>
                </tr>
                <tr>
                  <td class="p-2 border">MAN</td>
                  <td class="p-2 border">Metropolitan Area Network</td>
                  <td class="p-2 border">City</td>
                  <td class="p-2 border">Broadband providers</td>
                </tr>
                <tr>
                  <td class="p-2 border">WAN</td>
                  <td class="p-2 border">Wide Area Network</td>
                  <td class="p-2 border">Country/World</td>
                  <td class="p-2 border">Internet</td>
                </tr>
                <tr>
                  <td class="p-2 border">PAN</td>
                  <td class="p-2 border">Personal Area Network</td>
                  <td class="p-2 border">Few meters</td>
                  <td class="p-2 border">Bluetooth devices</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-3 p-3 rounded-lg border">
            <h4 class="text-md font-semibold mb-2">Terminal</h4>
            <p class="mb-1">See network interfaces: <code>ipconfig</code></p>
            <p class="mb-1">Check local network routing: <code>route print</code></p>
            <p class="mb-1">Find devices in LAN: <code>arp -a</code></p>
          </div>
          `
        ]
      }
    ]
  },
  {
    id: 'module-2',
    title: 'Cisco Packet Tracer â€“ Network Building',
    topics: [
      {
        id: 'installation-setup',
        title: 'Installation & Setup',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Lesson 1: Introduction to Cisco Packet Tracer</h2>
          <h3 class="text-lg font-semibold mb-2">What is Cisco Packet Tracer?</h3>
          <p class="mb-3">Cisco Packet Tracer is a network simulation software used to design, configure, and troubleshoot computer networks without needing real devices.</p>
          <h3 class="text-lg font-semibold mb-2">Purpose of Packet Tracer</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Practice networking skills safely</li>
            <li>Simulate network behavior</li>
            <li>Visualize how devices communicate</li>
            <li>Prepare for CCNA-level concepts</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">What You Can Do</h3>
          <ul class="list-disc pl-6">
            <li>Connect routers, switches, PCs, servers</li>
            <li>Configure IP addressing</li>
            <li>Test ping, packets, protocols</li>
            <li>Emulate small to large networks</li>
          </ul>
          `
        ]
      },
      {
        id: 'first-network',
        title: 'Creating Your First Network',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Lesson 2: Creating Your First Network</h2>
          <p class="mb-3">This lesson builds confidence by helping you create and test a very simple network: two PCs connected through a switch.</p>
          <h3 class="text-lg font-semibold mb-2">Understanding the Topology</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>PC0</li>
            <li>PC1</li>
            <li>Switch (2960)</li>
            <li>Copper Straight-through cables</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Steps</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Drag PC0 and PC1 onto the workspace.</li>
            <li>Drag a Switch (2960).</li>
            <li>Connect PC0 â†’ Switch using Copper Straight-Through.</li>
            <li>Connect PC1 â†’ Switch.</li>
            <li>Set IP addresses:</li>
          </ul>
          <div class="pl-6 mb-4">
            <p class="mb-1"><strong>PC0</strong> â†’ 192.168.1.2</p>
            <p class="mb-1"><strong>PC1</strong> â†’ 192.168.1.3</p>
            <p class="mb-1"><strong>Subnet mask</strong> â†’ 255.255.255.0</p>
          </div>
          <h3 class="text-lg font-semibold mb-2">Test Connection Using</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Ping</li>
            <li>Simulation panel</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <ul class="list-disc pl-6">
            <li>Understand how end devices communicate.</li>
            <li>Learn basic tools like the command prompt and simulation mode.</li>
            <li>Build confidence in constructing basic LANs.</li>
          </ul>
          `
        ]
      },
      {
        id: 'configure-routers-switches',
        title: 'Configuring Routers & Switches',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Lesson 3: Configuring Routers & Switches</h2>
          <p class="mb-3">Routers and switches are the heart of any network, and Packet Tracer lets you configure them like real Cisco devices.</p>
          <h3 class="text-lg font-semibold mb-2">Why Configure Them?</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Switches create LANs</li>
            <li>Routers connect LANs, WANs, and the internet</li>
            <li>Helps learn how real network infrastructure works</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Basic Router Configurations</h3>
          <pre class="bg-gray-800 text-gray-100 p-3 rounded mb-3"><code>enable
configure terminal
interface gig0/0
ip address 192.168.1.1 255.255.255.0
no shutdown</code></pre>
          <h3 class="text-lg font-semibold mb-2">Basic Switch Configurations</h3>
          <pre class="bg-gray-800 text-gray-100 p-3 rounded mb-3"><code>enable
configure terminal
hostname Switch1
vlan 10
name HR
interface fa0/1
switchport access vlan 10</code></pre>
          <h3 class="text-lg font-semibold mb-2">What You Learn</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Using CLI (Command Line Interface)</li>
            <li>Assigning IP addresses to router interfaces</li>
            <li>Configuring VLANs on switches</li>
            <li>Enabling/disabling interfaces</li>
            <li>Viewing device details</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Outcome</h3>
          <p>You become comfortable using Cisco IOS commands and understanding how a network is built internally.</p>
          `
        ]
      },
      {
        id: 'assigning-ip-addresses',
        title: 'Assigning IP Addresses',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Lesson 4: Assigning IP Addresses</h2>
          <p class="mb-3">Assigning IP addresses is one of the most important jobs in networking. Without proper addressing, no communication is possible.</p>
          <h3 class="text-lg font-semibold mb-2">Why IP Addressing Matters</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Every device on a network needs a unique IP</li>
            <li>IPs help identify devices like postal addresses</li>
            <li>IP structure defines how networks are designed</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">How to Assign IPs in Packet Tracer</h3>
          <h4 class="font-semibold mb-1">For a PC:</h4>
          <ul class="list-disc pl-6 mb-3">
            <li>Click PC â†’ Desktop â†’ IP Configuration</li>
            <li>Enter: IP Address, Subnet Mask, Default Gateway, DNS Server</li>
          </ul>
          <h4 class="font-semibold mb-1">For a Router:</h4>
          <pre class="bg-gray-800 text-gray-100 p-3 rounded mb-3"><code>interface gig0/1
ip address 10.0.0.1 255.255.255.0
no shutdown</code></pre>
          <h3 class="text-lg font-semibold mb-2">Important Concepts</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Private IP ranges</li>
            <li>Subnet masks</li>
            <li>Gateways</li>
            <li>DNS servers</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">What This Lesson Teaches</h3>
          <ul class="list-disc pl-6">
            <li>Designing a proper IP plan</li>
            <li>Creating functional networks</li>
            <li>Understanding how devices locate each other</li>
          </ul>
          `
        ]
      },
      {
        id: 'build-lan-wan',
        title: 'Building LAN & WAN Structures',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Lesson 5: Building LAN & WAN Structures</h2>
          <p class="mb-3">This lesson teaches how to design small to medium networks that include both Local Area Networks (LAN) and Wide Area Networks (WAN).</p>
          <h3 class="text-lg font-semibold mb-2">LAN Structure</h3>
          <p class="mb-1">LAN includes:</p>
          <ul class="list-disc pl-6 mb-3">
            <li>Switches</li>
            <li>PCs</li>
            <li>Printers</li>
            <li>Access Points</li>
            <li>Routers (gateway)</li>
          </ul>
          <p class="mb-1">LANs are used inside:</p>
          <ul class="list-disc pl-6 mb-3">
            <li>Offices</li>
            <li>Schools</li>
            <li>Homes</li>
            <li>Campuses</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">WAN Structure</h3>
          <p class="mb-1">WAN connects multiple LANs across large distances using:</p>
          <ul class="list-disc pl-6 mb-3">
            <li>Routers</li>
            <li>Serial interfaces</li>
            <li>Service provider networks</li>
            <li>Cloud connections</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">How to Build a LAN</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Add PCs + Switch</li>
            <li>Add Router</li>
            <li>Connect using Ethernet</li>
            <li>Assign LAN IPs</li>
            <li>Set default gateway</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">How to Build a WAN</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Add 2 Routers</li>
            <li>Connect using serial cables</li>
            <li>Configure:</li>
          </ul>
          <pre class="bg-gray-800 text-gray-100 p-3 rounded mb-3"><code>interface s0/0/0
ip address 10.1.1.1 255.255.255.252
clock rate 64000</code></pre>
          <ul class="list-disc pl-6 mb-3">
            <li>Add LANs behind each router</li>
            <li>Use routing protocols (RIP, OSPF)</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Purpose</h3>
          <ul class="list-disc pl-6">
            <li>Understand real-world network designs</li>
            <li>Learn how companies connect branches</li>
            <li>Build more advanced simulations</li>
          </ul>
          `
        ]
      },
      {
        id: 'simulate-network-traffic',
        title: 'Simulating Real-Time Network Traffic',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Lesson 6: Simulating Real-Time Network Traffic</h2>
          <p class="mb-3">Packet Tracer lets you see packets moving live through the network.</p>
          <h3 class="text-lg font-semibold mb-2">Modes Available</h3>
          <h4 class="font-semibold mb-1">Real-Time Mode</h4>
          <ul class="list-disc pl-6 mb-3">
            <li>Immediate results</li>
            <li>Suitable for basic testing</li>
          </ul>
          <h4 class="font-semibold mb-1">Simulation Mode</h4>
          <ul class="list-disc pl-6 mb-3">
            <li>Slow-motion view</li>
            <li>You can track every packet</li>
            <li>Helpful for troubleshooting</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">What You Can Observe</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>ARP requests</li>
            <li>ICMP echo requests (ping)</li>
            <li>DHCP discovery</li>
            <li>DNS queries</li>
            <li>TCP handshake</li>
            <li>Routing decisions</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Why Simulation Is Useful</h3>
          <ul class="list-disc pl-6">
            <li>Shows how networks behave internally</li>
            <li>Helps identify misconfigurations</li>
            <li>Helps understand protocol flow</li>
            <li>Teaches packet-level operations</li>
          </ul>
          `
        ]
      },
      {
        id: 'create-mini-lab',
        title: 'Creating Your Own Mini-Lab',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Lesson 7: Creating Your Own Mini-Lab</h2>
          <p class="mb-3">This lesson encourages you to build a full working network on your own.</p>
          <h3 class="text-lg font-semibold mb-2">What Your Lab Can Include</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>2 routers</li>
            <li>2 switches</li>
            <li>4 PCs</li>
            <li>One DHCP server</li>
            <li>One DNS server</li>
            <li>LAN on each side</li>
            <li>Serial WAN link between routers</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Lab Steps</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Build physical topology</li>
            <li>Assign IP addresses</li>
            <li>Configure router interfaces</li>
            <li>Create VLANs (optional)</li>
            <li>Configure DHCP</li>
            <li>Configure DNS</li>
            <li>Enable routing (RIP or OSPF)</li>
            <li>Test connectivity using ping</li>
            <li>Use Simulation mode to analyze traffic</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Outcome of the Lab</h3>
          <ul class="list-disc pl-6">
            <li>You develop real practical skills</li>
            <li>You understand how complete networks work</li>
            <li>You gain confidence for interviews and exams</li>
          </ul>
          `
        ]
      }
    ]
  },
  {
    id: 'module-3',
    title: 'Nmap â€“ Network Scanning Basics',
    topics: [
      {
        id: 'intro-network-scanning',
        title: 'Introduction to Network Scanning',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Introduction to Network Scanning</h2>

          <h3 class="text-lg font-semibold mb-2">What is Network Scanning?</h3>
          <p class="mb-3">Network scanning is the process of probing a range of IP addresses and ports to determine what hosts are up, which services those hosts offer, and optionally what operating systems or application versions they are running. It provides visibility into network assets and is a foundational activity in network management, vulnerability assessment, and penetration testing.</p>

          <h3 class="text-lg font-semibold mb-2">History & Context</h3>
          <p class="mb-3">Network scanning evolved as networks became large and heterogeneous. Early administrators used simple ping sweeps and scripted port checks. Nmap (1997) consolidated many techniques, added performance optimizations and OS/service fingerprinting, and provided a flexible, extensible platform.</p>

          <h3 class="text-lg font-semibold mb-2">Primary Purposes</h3>
          <ul class="list-disc pl-6 mb-3">
            <li><strong>Inventory</strong>: discover hosts and services (which machines exist and what they run).</li>
            <li><strong>Security Assessment</strong>: reveal exposed services that may need patching or hardening.</li>
            <li><strong>Troubleshooting & Operations</strong>: check whether services are reachable, verify firewall and routing rules.</li>
            <li><strong>Compliance</strong>: produce evidence of service exposure for audits.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">How scanning fits into the security lifecycle</h3>
          <p class="mb-3">Discovery &rarr; Enumeration &rarr; Analysis &rarr; Remediation. Scanning is the discovery/enumeration phase: identify targets and what they expose; analysis and remediation follow.</p>

          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Fast visibility across many hosts.</li>
            <li>Can be automated and scheduled.</li>
            <li>Rich feature set (host discovery, port enumeration, version detection, OS fingerprinting, scripts).</li>
            <li>Widely supported and documented — many integrations and GUIs (Zenmap).</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Disadvantages / Limitations</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Active scanning is noisy: it generates traffic that may be logged or trigger IDS/IPS.</li>
            <li>False positives/negatives: some services hide behind proxies/firewalls; states may change.</li>
            <li>Legal risk: scanning without permission can be illegal in many jurisdictions.</li>
            <li>Incomplete picture: open port ≠ vulnerability — further analysis required.</li>
            <li>Timing/impact: aggressive scans can affect production devices.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Ethical & Legal Considerations</h3>
          <p class="mb-3">Perform scans only in labs, on owned infrastructure, or with explicit written permission (scope, time window, IP ranges). Maintain responsible disclosure if you find a vulnerability on a customer’s network.</p>

          <h3 class="text-lg font-semibold mb-2">Alternatives & Complementary Tools</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Passive discovery tools: p0f, passive network traffic analysis (safer but slower).</li>
            <li>Other active scanners: masscan (ultra-fast port scanner), unicornscan (async scanner), netcat (manual probes for service testing).</li>
            <li>Commercial tools: Tenable Nessus, Rapid7 Nexpose (combine scanning + vulnerability checks).</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Syntax â€” conceptual overview</h3>
          <p class="mb-2">Nmapâ€™s basic invocation:</p>
          <pre class="p-3 rounded-lg border"><code>nmap [options] &lt;target-spec&gt;</code></pre>
          <p class="mb-2">Target-spec can be single IP, CIDR (e.g., <code>192.168.1.0/24</code>), range (e.g., <code>192.168.1.1-50</code>), or hostname.</p>
          <p class="mb-2">Key options overview (expanded later): <code>-sS</code>, <code>-sU</code>, <code>-sT</code>, <code>-sn</code>, <code>-p</code>, <code>-A</code>, <code>-sV</code>, <code>-O</code>, <code>-T0..T5</code>, <code>-oN/-oX/-oG</code>, <code>--script</code>.</p>

          <h3 class="text-lg font-semibold mb-2">Live Terminal â€” safe beginner examples</h3>
          <p class="mb-2">Run only in your lab network or on hosts you control.</p>
          <ul class="list-disc pl-6">
            <li>
              Ping-like host discovery (no port scan)
              <pre class="p-3 rounded-lg border"><code>nmap -sn 192.168.1.0/24</code></pre>
            </li>
            <li>
              Simple TCP connect scan (non-root)
              <pre class="p-3 rounded-lg border"><code>nmap -sT 192.168.1.10</code></pre>
            </li>
            <li>
              Basic port scan (common ports)
              <pre class="p-3 rounded-lg border"><code>nmap -p 22,80,443 192.168.1.10</code></pre>
            </li>
          </ul>
          `
        ]
      },
      {
        id: 'port-scanning-host-discovery',
        title: 'Port Scanning & Host Discovery',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Port Scanning & Host Discovery</h2>

          <h3 class="text-lg font-semibold mb-2">Host discovery (host-up detection)</h3>
          <p class="mb-3">Before scanning ports you often want to know which addresses actually respond. Host discovery may use ICMP echo (ping), TCP/UDP probes, ARP (on LANs), or higher-level application checks.</p>

          <h3 class="text-lg font-semibold mb-2">Why separate host discovery and port scanning?</h3>
          <ul class="list-disc pl-6 mb-3">
            <li><strong>Saves time</strong>: donâ€™t waste port-scan resources on dead hosts.</li>
            <li><strong>Reduces noise</strong>: targeted scanning is less noisy than scanning every IP+port.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Common host discovery techniques</h3>
          <ul class="list-disc pl-6 mb-3">
            <li><strong>ICMP Echo (ping)</strong>: fast but often blocked by firewalls.</li>
            <li><strong>ARP requests (LAN only)</strong>: reliable and fast for local subnets.</li>
            <li><strong>TCP SYN to common port (e.g., 80)</strong>: often successful but may trigger logs.</li>
            <li><strong>No-ping scans</strong>: skip host discovery if pings are blocked and directly probe ports.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Port scanning (what it is & what it finds)</h3>
          <ul class="list-disc pl-6 mb-3">
            <li><strong>open</strong> â€” service responds and likely accepts connections.</li>
            <li><strong>closed</strong> â€” host reachable, but port not listening.</li>
            <li><strong>filtered</strong> â€” packet dropped/blocked by firewall or filtered (no response).</li>
            <li><strong>unfiltered</strong> â€” reachable but Nmap cannot determine open/closed for UDP.</li>
            <li><strong>open|filtered / closed|filtered</strong> â€” ambiguous states for some techniques.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Why ports matter</h3>
          <p class="mb-3">Each open port often maps to an application (e.g., 22â†’SSH, 80â†’HTTP). An exposed service may require patching or access control.</p>

          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Pinpoints attack surface.</li>
            <li>Enables prioritization of remediation.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>May trigger alerts in IDS/IPS.</li>
            <li>Port states can be intentionally manipulated (honeypots, tarpit).</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">How it would be without port scanning</h3>
          <p class="mb-3">Network engineers would lack a fast way to inventory service exposure; discovery would depend entirely on manual asset lists (often incomplete) and passive traffic analysis.</p>

          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6">
            <li>Passive discovery: analyze network flows (NetFlow, sFlow), ARP cache, DHCP logs.</li>
            <li>Agent-based inventory: run an agent on each host to report open services (but requires deployment).</li>
          </ul>
          `
        ]
      },
      {
        id: 'nmap-commands',
        title: 'Nmap Commands',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Nmap Commands</h2>

          <h3 class="text-lg font-semibold mb-2">Nmap design philosophy</h3>
          <p class="mb-3">Nmapâ€™s syntax is intentionally modular: pick discovery method, port probe method, service/OS detection options, timing, and output. Students should learn to start with safe, low-impact scans and escalate as the lab requires.</p>

          <h3 class="text-lg font-semibold mb-2">When Nmap was introduced and evolution</h3>
          <p class="mb-3">Nmap debuted in 1997; over time it incorporated scripting (NSE â€” Nmap Scripting Engine), performance improvements, and fingerprinting databases for services/OS. NSE allows automation of checks (version scanning, vulnerability detection, brute force scripts), but NSE scripts should be used cautiously in production labs.</p>

          <h3 class="text-lg font-semibold mb-2">Advantages of Nmapâ€™s command model</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Flexible, powerful, scriptable.</li>
            <li>Many built-in probes and fingerprint databases.</li>
            <li>Outputs suitable for human reading and automation (normal, XML, grepable).</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Disadvantages & risks</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Many options â†’ steep learning curve.</li>
            <li>Certain options can be intrusive (NSE vuln scripts, aggressive timings).</li>
            <li>Misuse can break a device or cause security alarms.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6">
            <li>Zenmap â€” official GUI for Nmap (great for beginners).</li>
            <li>masscan â€” extreme-scale port scanning (faster but less feature-rich).</li>
            <li>netcat â€” manual probing of services.</li>
            <li>ncscan / rustscan â€” newer fast scanners.</li>
          </ul>
          `
        ]
      },
      {
        id: 'scanning-techniques',
        title: 'Scanning Techniques (SYN Scan, UDP Scan)',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Scanning Techniques â€” Detailed Overview</h2>

          <h3 class="text-lg font-semibold mb-2">TCP SYN scan (<code>-sS</code>)</h3>
          <p class="mb-2">Nmap sends a TCP SYN to the target port. If it receives SYN/ACK, the port is likely open; Nmap then sends an RST to tear down the half-open connection (no full TCP handshake). This is quicker and less intrusive than completing the handshake. Requires raw socket access (usually root).</p>
          <p class="mb-2"><strong>Use & purpose:</strong> Fast, default privileged scan to find open TCP ports with minimal connection establishment.</p>
          <ul class="list-disc pl-6 mb-3">
            <li><strong>Advantages:</strong> Speed; sometimes less logging compared to full connect.</li>
            <li><strong>Disadvantages:</strong> Visible to IDS/IPS and modern firewalls; SYNs are often logged; raw sockets may be blocked.</li>
          </ul>
          <p class="text-xs opacity-80 mb-4"><em>Ethical note:</em> Run only in permissioned environments. SYN scans can be seen as intrusive.</p>

          <h3 class="text-lg font-semibold mb-2">UDP scan (<code>-sU</code>)</h3>
          <p class="mb-2">Nmap sends UDP packets to target ports. UDP is connectionless; an ICMP Port Unreachable (type 3, code 3) typically means the port is closed. Lack of response may indicate <code>open|filtered</code>. UDP scanning is slower because many services are silent or rate-limit ICMP.</p>
          <p class="mb-2"><strong>Use & purpose:</strong> Enumerate UDP services (DNS 53, SNMP 161, NTP 123, etc.). UDP services are common attack surfaces.</p>
          <ul class="list-disc pl-6 mb-3">
            <li><strong>Advantages:</strong> Finds services that TCP scans miss.</li>
            <li><strong>Disadvantages:</strong> Slow; many ambiguous states; susceptible to rate-limits and side effects.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Other scans (brief)</h3>
          <ul class="list-disc pl-6 mb-3">
            <li><code>-sT</code> (Connect scan) â€” full TCP connect; use when not root.</li>
            <li><code>-sA</code> (ACK scan) â€” map firewall statefulness / rules.</li>
            <li><code>-sV</code> (Version detection) â€” probe services to identify application/version.</li>
            <li>Idle/Xmas/Null/FIN â€” older stealth scans; modern stacks may flag or ignore.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Practical considerations</h3>
          <ul class="list-disc pl-6">
            <li>Speed vs accuracy tradeoff â€” use <code>-T</code> templates to tune.</li>
            <li>OS & firewall configurations can mislead (stateful drops; proxies alter packets).</li>
            <li>Combine TCP+UDP for full surface mapping; be mindful of load and ethics.</li>
          </ul>
          `
        ]
      },
      {
        id: 'detect-services-os',
        title: 'Detecting Services & OS Fingerprinting',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Detecting Services & OS Fingerprinting</h2>

          <h3 class="text-lg font-semibold mb-2">Service detection (<code>-sV</code>)</h3>
          <p class="mb-2">Map an open port to a running service and discover its version (e.g., Apache 2.4.41). Nmap sends protocol-aware probes and matches responses against a signature database. Version detection helps prioritize patching (known vulnerable versions are high risk).</p>

          <h3 class="text-lg font-semibold mb-2">OS fingerprinting (<code>-O</code>)</h3>
          <p class="mb-2">Guess the remote host operating system (kernel, version). Nmap examines subtle differences in TCP/IP stack behavior (IP ID sequences, TTL defaults, TCP options ordering) and compares them with signatures. Results are probabilistic and include a confidence score.</p>

          <h3 class="text-lg font-semibold mb-2">How they work</h3>
          <ul class="list-disc pl-6 mb-3">
            <li><strong>Active fingerprinting:</strong> send crafted packets, analyze returned values (Nmap uses both TCP and ICMP probes).</li>
            <li><strong>Passive fingerprinting:</strong> observe traffic without sending probes (safer but slower; use separate tools).</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Actionable information (version â†’ CVE mapping).</li>
            <li>Helps prioritize remediation (e.g., public-facing outdated services).</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Disadvantages & limits</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>False positives/negatives: proxies, load balancers, NAT, or middleboxes can alter responses.</li>
            <li>OS fingerprinting can be ambiguous: VMs/containers may produce inconsistent signatures.</li>
            <li>Active probes can be intrusive: may trigger application faults or alarms.</li>
          </ul>

          <h3 class="text-lg font-semibold mb-2">Ethical considerations</h3>
          <p class="mb-3">Service & OS fingerprinting intrude into host internals. Only do it within allowed scope. Automated version detection scripts may attempt banner grabs or protocol negotiation â€” these can cause side effects on fragile systems.</p>

          <h3 class="text-lg font-semibold mb-2">Alternatives & complements</h3>
          <ul class="list-disc pl-6">
            <li>Banner grabbing with netcat or curl for specific services.</li>
            <li>Passive tools: Bro/Zeek for passive service identification.</li>
            <li>Vulnerability scanners mapping versions to CVEs (Nessus, OpenVAS) â€” use with permission.</li>
          </ul>
          `
        ]
      }
    ]
  },
  {
    id: 'module-4',
    title: 'Wireshark â€“ Packet Analysis',
    topics: [
      {
        id: 'intro-packet-capturing',
        title: 'Introduction to Packet Capturing',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Introduction to Packet Capturing</h2>
          <p class="mb-2">Wireshark is the worldâ€™s most widely-used packet analyzer. Created in 1998 (as Ethereal) by Gerald Combs, it became the standard tool for network engineers, security analysts, and forensic investigators. It lets you capture live traffic and inspect packets moving across a network.</p>
          <h3 class="text-lg font-semibold mb-2">Why packet capturing matters</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Identify performance issues and dropped/slow packets.</li>
            <li>Detect security threats and suspicious traffic.</li>
            <li>Verify protocol operations (DHCP, DNS, ARP, TCP handshake).</li>
            <li>Understand device behavior across OSI layers.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">What you can see</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>IP conversations and protocol operations.</li>
            <li>Authentication handshakes and TCP 3â€‘way handshakes.</li>
            <li>DHCP, DNS, ARP traffic and potential malicious packets.</li>
            <li>Unauthorized or suspicious flows.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Free, openâ€‘source, and crossâ€‘platform (Windows/Linux/macOS).</li>
            <li>Realâ€‘time capture with rich protocol decoding.</li>
            <li>Graphs, statistics, and flow diagrams.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Requires technical understanding; large captures are overwhelming.</li>
            <li>May expose sensitive data if misused.</li>
            <li>Encrypted content isnâ€™t visible (headers only).</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6 mb-3">
            <li><code>tcpdump</code> (CLI)</li>
            <li><code>TShark</code> (Wireshark CLI)</li>
            <li>Microsoft Message Analyzer, NetworkMiner, SolarWinds DPI</li>
          </ul>
          `
        ]
      },
      {
        id: 'frames-packets-segments',
        title: 'Understanding Frames, Packets & Segments',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Understanding Frames, Packets & Segments</h2>
          <p class="mb-2">Data moves through the OSI model as distinct units. Wireshark displays these structured layers: <strong>Frame â†’ Packet â†’ Segment â†’ Data</strong>.</p>
          <h3 class="text-lg font-semibold mb-2">Frame (Layer 2)</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Contains MAC source/destination, EtherType (IPv4/IPv6/ARP), CRC.</li>
            <li>Operates within the same LAN; does not traverse routers.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Packet (Layer 3)</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Contains IP source/destination, TTL, protocol (TCP/UDP/ICMP), fragmentation flags.</li>
            <li>Routable across LANs/WANs and the Internet.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Segment (Layer 4)</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Contains TCP/UDP src/dst ports, sequence/ack numbers, flags (SYN/ACK/FIN/RST).</li>
            <li>Controls reliability and flow of communication.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Purpose in Wireshark</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>See physical movement (frame), logical addressing (packet), and reliability/flow control (segment).</li>
            <li>Analyze TCP handshake, retransmissions, ARP issues, DNS delays, routing problems.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Alternatives to learn this</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Packet Tracer, GNS3, Linux <code>tcpdump</code>.</li>
          </ul>
          `
        ]
      },
      {
        id: 'traffic-filtering',
        title: 'Traffic Filtering',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Traffic Filtering</h2>
          <p class="mb-2">Filtering is essential. Networks produce massive packets; filters enable focus.</p>
          <h3 class="text-lg font-semibold mb-2">Filter types</h3>
          <ul class="list-disc pl-6 mb-3">
            <li><strong>Capture Filters</strong> (before capture): reduce stored data. Examples: <code>host 192.168.1.10</code>, <code>port 80</code>.</li>
            <li><strong>Display Filters</strong> (after capture): narrow to specific packets. Examples: <code>ip.src == 10.0.0.5</code>, <code>tcp.flags.syn == 1</code>, <code>dns</code>.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Purpose of filtering</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Focus on one conversation or isolate a protocol.</li>
            <li>Detect malicious packets and reduce analysis time.</li>
            <li>Follow a single flow.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Saves time, simplifies complex analysis, aids protocol debugging.</li>
            <li>Essential for investigations.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Incorrect filters mislead; learning syntax takes time.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>TShark filters; <code>tcpdump</code> BPF filters.</li>
          </ul>
          `
        ]
      },
      {
        id: 'analyzing-tcp-udp-traffic',
        title: 'Analyzing TCP/UDP Traffic',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Analyzing TCP/UDP Traffic</h2>
          <p class="mb-2">TCP and UDP are the most fundamental transport protocols. Wireshark helps visualize how they behave in real-time for troubleshooting and performance analysis.</p>
          <h3 class="text-lg font-semibold mb-2">TCP Analysis</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>3â€‘way handshake (SYN â†’ SYN/ACK â†’ ACK)</li>
            <li>Sequence numbers and acknowledgments</li>
            <li>Retransmissions and duplicate ACKs</li>
            <li>Window size, flow control, congestion control</li>
            <li>TCP resets (RST) and abnormal terminations</li>
          </ul>
          <p class="mb-3">Wiresharkâ€™s TCP stream graphs visualize RTT, packet loss, throughput, and timeâ€‘sequence.</p>
          <h3 class="text-lg font-semibold mb-2">UDP Analysis</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Connectionâ€‘less and faster; common in DNS, DHCP, VoIP, gaming, streaming</li>
            <li>View source/destination ports, packet length, and payload details</li>
            <li>Spot missing packets and analyze DNS query/response behavior</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Importance of Analysis</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Troubleshoot web app issues and server delays</li>
            <li>Diagnose packet loss, retransmissions, and QoS problems</li>
            <li>Investigate VoIP/video quality issues</li>
            <li>Cybersecurity threat detection and anomaly investigation</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>High visibility of communication</li>
            <li>Direct evidence of delays/drops</li>
            <li>Excellent for debugging applications</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Encrypted traffic (TLS) limits applicationâ€‘level visibility</li>
            <li>Requires strong networking fundamentals</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6 mb-3">
            <li><code>netstat</code>, <code>ss</code>, <code>tcpdump</code></li>
          </ul>
          `
        ]
      },
      {
        id: 'detect-network-issues-wireshark',
        title: 'Detecting Network Issues with Wireshark',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Detecting Network Issues with Wireshark</h2>
          <p class="mb-2">Wireshark reveals packetâ€‘level problems that normal commands cannot detect, helping identify exactly where communication fails.</p>
          <h3 class="text-lg font-semibold mb-2">Common Issues Wireshark Can Detect</h3>
          <ol class="list-decimal pl-6 mb-3">
            <li>
              <strong>Packet Loss</strong> â€” look for retransmissions, duplicate ACKs, outâ€‘ofâ€‘order packets.
              <div class="mt-1"><code>tcp.analysis.retransmission</code></div>
            </li>
            <li>
              <strong>High Latency</strong> â€” measure RTT; detect delayed ACKs via time graphs.
            </li>
            <li>
              <strong>DNS Problems</strong> â€” slow resolution, no response, wrong replies.
              <div class="mt-1"><code>dns</code>, <code>dns.flags.response == 0</code></div>
            </li>
            <li>
              <strong>DHCP Issues</strong> â€” client not receiving IP, repeated Discover.
              <div class="mt-1"><code>bootp</code></div>
            </li>
            <li>
              <strong>Routing Problems</strong> â€” ICMP unreachable, TTL exceeded.
              <div class="mt-1"><code>icmp</code></div>
            </li>
            <li>
              <strong>TCP Resets</strong> â€” connection unexpectedly closed.
              <div class="mt-1"><code>tcp.flags.reset == 1</code></div>
            </li>
            <li>
              <strong>ARP Issues</strong> â€” IP conflict, ARP spoofing, incomplete requests.
              <div class="mt-1"><code>arp</code></div>
            </li>
          </ol>
          <h3 class="text-lg font-semibold mb-2">Why Wireshark is Irreplaceable</h3>
          <p class="mb-3">Tools like ping can say â€œhost unreachable,â€ but not <em>why</em>. Wireshark shows where a packet failed â€” handshake, routing, DNS, or application layer.</p>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Deep packetâ€‘level visibility with accurate issue identification</li>
            <li>Useful in cybersecurity incident response</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Requires experience to interpret packets</li>
            <li>Large captures can be hard to manage</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6 mb-3">
            <li><code>tcpdump</code>, NetFlow analyzers, Zabbix / PRTG / SolarWinds</li>
          </ul>
          `
        ]
      }
    ]
  },
  {
    id: 'module-5',
    title: 'Networking Troubleshooting',
    topics: [
  {
    id: 'common-network-problems',
    title: 'Common Network Problems',
    theoryPages: [
      `
      <h2 class="text-xl font-semibold mb-3">Common Network Problems</h2>
      <p class="mb-2">Network problems occur when devices cannot communicate properly due to failures in hardware, software, configuration, routing, DNS, or connectivity. They slow down or completely break communication.</p>
      <h3 class="text-lg font-semibold mb-2">Why Network Problems Occur</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Incorrect configurations</li>
        <li>Faulty devices</li>
        <li>Weak WiFi</li>
        <li>Wrong IP settings</li>
        <li>DNS failures</li>
        <li>Cable/port issues</li>
        <li>Firewall blocking</li>
        <li>Congested networks</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Purpose</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Identify the root cause</li>
        <li>Restore communication</li>
        <li>Optimize network performance</li>
        <li>Maintain uptime</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Advantages</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Quickly identify issues</li>
        <li>Reduces downtime</li>
        <li>Improves user experience</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Timeconsuming</li>
        <li>Requires technical knowledge</li>
        <li>Sometimes intermittent</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Common Network Problems</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>No internet</li>
        <li>Limited connectivity</li>
        <li>IP conflict</li>
        <li>Wrong gateway</li>
        <li>DNS not resolving</li>
        <li>Slow speed</li>
        <li>Packet loss</li>
        <li>High latency</li>
      </ul>
      `
    ]
  },
  {
    id: 'ping-traceroute-netstat-ipconfig',
    title: 'Ping, Traceroute, Netstat, ipconfig',
    theoryPages: [
      `
      <h2 class="text-xl font-semibold mb-3">🔵 Topic 2: PING, TRACEROUTE, NETSTAT, IPCONFIG</h2>
      <h3 class="text-lg font-semibold mb-2">Ping</h3>
      <p class="mb-2"><strong>Purpose:</strong> Tests connectivity to a host.</p>
      <p class="mb-2"><strong>Use:</strong> Sends ICMP Echo packets to check if device is reachable.</p>
      <h3 class="text-lg font-semibold mb-2">Traceroute / Tracert</h3>
      <p class="mb-2"><strong>Purpose:</strong> Shows the path (hops) that packets take.</p>
      <p class="mb-2"><strong>Use:</strong> Helps identify where packets are getting delayed or dropped.</p>
      <h3 class="text-lg font-semibold mb-2">Netstat</h3>
      <p class="mb-2"><strong>Purpose:</strong> Shows active ports, sockets, and connections.</p>
      <p class="mb-2"><strong>Use:</strong> Identify open services, troubleshoot port conflicts.</p>
      <h3 class="text-lg font-semibold mb-2">Ipconfig / Ifconfig</h3>
      <p class="mb-2"><strong>Purpose:</strong> Shows local IP settings.</p>
      <p class="mb-2"><strong>Use:</strong> Check IP, gateway, DNS, interfaces.</p>
      <h3 class="text-lg font-semibold mb-2">Advantages</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Simple & fast troubleshooting</li>
        <li>Works on all OS</li>
        <li>Provides live real-time data</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Cannot diagnose all issues</li>
        <li>Requires interpretation skills</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Alternatives Without These Tools</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Manual hardware checks</li>
        <li>No visibility of path, latency, ports</li>
        <li>Troubleshooting becomes guesswork</li>
      </ul>
      `
    ]
  },
  {
    id: 'connectivity-issues',
    title: 'Connectivity Issues',
    theoryPages: [
      `
      <h2 class="text-xl font-semibold mb-3">🔵 Topic 3: CONNECTIVITY ISSUES</h2>
      <p class="mb-2"><strong>What are Connectivity Issues?</strong> Devices can’t communicate with each other or the internet.</p>
      <h3 class="text-lg font-semibold mb-2">Causes</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Wrong IP/subnet</li>
        <li>Bad cable</li>
        <li>Wi‑Fi weak signal</li>
        <li>Router down</li>
        <li>DNS not working</li>
        <li>Firewall blocking</li>
        <li>ISP problems</li>
        <li>Packet loss</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Purpose of Diagnosing Connectivity</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Restore connection</li>
        <li>Identify whether problem is local or ISP</li>
        <li>Ensure smooth data flow</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Advantages</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Quick identification</li>
        <li>Helps isolate which layer failed</li>
        <li>Fixes internet/WAN/LAN issues</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Sometimes intermittent issues</li>
        <li>Hard to diagnose without tools</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">What if Tools Did Not Exist?</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Manual troubleshooting of cables and hardware</li>
        <li>Very slow issue detection</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Wireshark</li>
        <li>ARP scanning</li>
        <li>Router logs</li>
      </ul>
      `
    ]
  },
  {
    id: 'dns-routing-problems',
    title: 'Diagnosing DNS & Routing Problems',
    theoryPages: [
      `
      <h2 class="text-xl font-semibold mb-3">🔵 Topic 4: DIAGNOSING DNS & ROUTING PROBLEMS</h2>
      <h3 class="text-lg font-semibold mb-2">DNS Problems</h3>
      <p class="mb-2">DNS issues happen when domain names cannot be converted into IP addresses.</p>
      <h4 class="text-md font-semibold mb-2">Causes</h4>
      <ul class="list-disc pl-6 mb-3">
        <li>Wrong DNS server</li>
        <li>DNS cache corrupted</li>
        <li>DNS server down</li>
        <li>ISP DNS slow</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Routing Problems</h3>
      <p class="mb-2">Routing issues happen at Layer 3 when packets cannot find the correct path.</p>
      <h4 class="text-md font-semibold mb-2">Causes</h4>
      <ul class="list-disc pl-6 mb-3">
        <li>Incorrect gateway</li>
        <li>Wrong static route</li>
        <li>Routing loop</li>
        <li>Router misconfiguration</li>
        <li>Network segmentation issues</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Purpose</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Ensure internet access</li>
        <li>Ensure LAN/WAN communication</li>
        <li>Identify where communication stops</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Advantages</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Identify path failures</li>
        <li>Shows DNS resolution process</li>
        <li>Helps correct routing issues</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Requires network knowledge</li>
        <li>Hard to diagnose large networks</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">What If DNS & Routing Tools Didn't Exist?</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Domains would have to be accessed by IP only</li>
        <li>Admins would manually configure routing</li>
        <li>Slow communication setup</li>
      </ul>
      `
    ]
  },
  {
    id: 'troubleshooting-tools-best-practices',
    title: 'Tools and Best Practices for Troubleshooting',
    theoryPages: [
      `
      <h2 class="text-xl font-semibold mb-3">🔵 Topic 5: TOOLS & BEST PRACTICES FOR TROUBLESHOOTING</h2>
      <h3 class="text-lg font-semibold mb-2">Popular Troubleshooting Tools</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Ping – ICMP connectivity</li>
        <li>Traceroute – Route path</li>
        <li>Netstat – Ports & sockets</li>
        <li>Wireshark – Packet capture</li>
        <li>Nmap – Port scanning</li>
        <li>Ipconfig/Ifconfig – Interface details</li>
        <li>SNMP Tools – Monitoring</li>
        <li>Syslogs – Router/server logs</li>
        <li>Network analyzers – SolarWinds, PRTG</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Best Practices</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Start from Layer 1: check cables, ports, link lights</li>
        <li>Ensure device is powered on</li>
        <li>Verify IP configuration: IP, Gateway, DNS</li>
        <li>Ping tests: self → gateway → DNS → internet</li>
        <li>Check routing: ensure correct routes exist</li>
        <li>Check firewalls: Windows firewall, Router ACL, Security groups</li>
        <li>Check DNS resolution: test using nslookup</li>
        <li>Document the problem: what was done, what fixed it</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Advantages</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Efficient troubleshooting</li>
        <li>Minimizes downtime</li>
        <li>Faster diagnosis</li>
      </ul>
      <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
      <ul class="list-disc pl-6 mb-3">
        <li>Requires technical knowledge</li>
        <li>Some tools overwhelming for beginners</li>
      </ul>
      `
    ]
  }
]
  }
,
  {
    id: 'module-6',
    title: 'Network Devices & Firewalls',
    topics: [
      {
        id: 'routers-switches-access-points',
        title: 'Routers, Switches, Access Points',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Routers, Switches, Access Points</h2>
          <h3 class="text-lg font-semibold mt-4">Routers</h3>
          <p>Routers are Layer 3 devices responsible for forwarding packets between different networks. They examine IP addresses, choose the best path, and direct traffic accordingly.</p>
          <h4 class="font-semibold mt-3">Purpose</h4>
          <ul class="list-disc pl-6">
            <li>Connects different networks (LAN to WAN, LAN to LAN)</li>
            <li>Performs routing using routing tables</li>
            <li>Acts as a gateway to the internet</li>
            <li>Provides NAT, DHCP, firewall functions in home routers</li>
          </ul>
          <h4 class="font-semibold mt-3">When Introduced</h4>
          <p>Routers began evolving in the mid-1980s when TCP/IP networks expanded.</p>
          <h4 class="font-semibold mt-3">Advantages</h4>
          <ul class="list-disc pl-6">
            <li>Allows communication between multiple networks</li>
            <li>Provides security controls</li>
            <li>Supports routing protocols (OSPF, EIGRP)</li>
            <li>Enhances network performance</li>
          </ul>
          <h4 class="font-semibold mt-3">Disadvantages</h4>
          <ul class="list-disc pl-6">
            <li>Expensive</li>
            <li>Requires configuration skills</li>
            <li>Routing loops can occur if misconfigured</li>
          </ul>
          <h4 class="font-semibold mt-3">Without Routers?</h4>
          <ul class="list-disc pl-6">
            <li>No internet connectivity</li>
            <li>Networks would remain isolated</li>
            <li>Large organizations would fail to communicate</li>
          </ul>
          <h4 class="font-semibold mt-3">Alternatives</h4>
          <ul class="list-disc pl-6">
            <li>Layer 3 Switch</li>
            <li>Software Routers (MikroTik, pfSense)</li>
          </ul>
          
          <h3 class="text-lg font-semibold mt-6">Switches</h3>
          <p>Switches are Layer 2 devices that connect multiple devices inside the same network and forward frames based on MAC addresses.</p>
          <h4 class="font-semibold mt-3">Purpose</h4>
          <ul class="list-disc pl-6">
            <li>Builds internal LAN</li>
            <li>Reduces collisions using switching</li>
            <li>Creates VLANs (in managed switches)</li>
          </ul>
          <h4 class="font-semibold mt-3">Advantages</h4>
          <ul class="list-disc pl-6">
            <li>High-speed LAN connectivity</li>
            <li>Intelligent forwarding</li>
            <li>Secure segmentation with VLANs</li>
          </ul>
          <h4 class="font-semibold mt-3">Disadvantages</h4>
          <ul class="list-disc pl-6">
            <li>Cannot route between networks</li>
            <li>MAC table overflow attacks possible</li>
          </ul>
          <h4 class="font-semibold mt-3">Alternatives</h4>
          <ul class="list-disc pl-6">
            <li>Hubs (older, inefficient)</li>
            <li>Bridges (older technology)</li>
          </ul>
          
          <h3 class="text-lg font-semibold mt-6">Access Points (APs)</h3>
          <p>Access Points provide wireless network connectivity by converting wired signals into wireless.</p>
          <h4 class="font-semibold mt-3">Purpose</h4>
          <ul class="list-disc pl-6">
            <li>Extends Wi-Fi coverage</li>
            <li>Allows mobile/wireless device connection</li>
            <li>Provides SSID broadcasting</li>
          </ul>
          <h4 class="font-semibold mt-3">Advantages</h4>
          <ul class="list-disc pl-6">
            <li>Mobility</li>
            <li>Scalability</li>
            <li>Easy expansion of Wi-Fi</li>
          </ul>
          <h4 class="font-semibold mt-3">Disadvantages</h4>
          <ul class="list-disc pl-6">
            <li>Interference issues</li>
            <li>Lower speed than wired</li>
            <li>Requires careful placement</li>
          </ul>
          <h4 class="font-semibold mt-3">Alternatives</h4>
          <ul class="list-disc pl-6">
            <li>Wi-Fi Mesh Systems</li>
            <li>Wi-Fi Extenders</li>
          </ul>
          `
        ]
      },
      {
        id: 'modems-hubs-repeaters-bridges',
        title: 'Modems, Hubs, Repeaters, Bridges',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Modems, Hubs, Repeaters, Bridges</h2>
          <h3 class="text-lg font-semibold mt-4">Modems</h3>
          <p>Modems convert digital signals to analog signals and vice-versa, enabling communication over telephone or cable lines.</p>
          <h4 class="font-semibold mt-3">Purpose</h4>
          <ul class="list-disc pl-6">
            <li>Provides internet from ISP</li>
            <li>Performs modulation/demodulation</li>
          </ul>
          <h4 class="font-semibold mt-3">Advantages</h4>
          <ul class="list-disc pl-6">
            <li>Needed for broadband/internet access</li>
            <li>Reliable for long-distance communication</li>
          </ul>
          <h4 class="font-semibold mt-3">Disadvantages</h4>
          <ul class="list-disc pl-6">
            <li>Lower speed</li>
            <li>Old tech compared to fiber ONUs</li>
          </ul>

          <h3 class="text-lg font-semibold mt-6">Hubs</h3>
          <p>Hubs are Layer 1 devices that broadcast data to all connected devices. They do not understand MAC/IP.</p>
          <h4 class="font-semibold mt-3">Purpose</h4>
          <ul class="list-disc pl-6">
            <li>Basic LAN connectivity</li>
          </ul>
          <h4 class="font-semibold mt-3">Advantages</h4>
          <ul class="list-disc pl-6">
            <li>Cheap</li>
            <li>No configuration required</li>
          </ul>
          <h4 class="font-semibold mt-3">Disadvantages</h4>
          <ul class="list-disc pl-6">
            <li>Very insecure</li>
            <li>Broadcasts to all → collisions</li>
            <li>Obsolete</li>
          </ul>

          <h3 class="text-lg font-semibold mt-6">Repeaters</h3>
          <p>Repeaters boost weak signals to extend network distance.</p>
          <h4 class="font-semibold mt-3">Purpose</h4>
          <ul class="list-disc pl-6">
            <li>Regenerate and amplify signals</li>
          </ul>
          <h4 class="font-semibold mt-3">Advantages</h4>
          <ul class="list-disc pl-6">
            <li>Extends cable length</li>
            <li>Reduces data loss</li>
          </ul>
          <h4 class="font-semibold mt-3">Disadvantages</h4>
          <ul class="list-disc pl-6">
            <li>Cannot filter traffic</li>
            <li>Not intelligent</li>
          </ul>

          <h3 class="text-lg font-semibold mt-6">Bridges</h3>
          <p>Bridges divide LANs and forward traffic based on MAC addresses.</p>
          <h4 class="font-semibold mt-3">Purpose</h4>
          <ul class="list-disc pl-6">
            <li>Splits LAN into segments</li>
            <li>Reduces collisions</li>
          </ul>
          <h4 class="font-semibold mt-3">Advantages</h4>
          <ul class="list-disc pl-6">
            <li>Improves performance</li>
            <li>Filters traffic</li>
          </ul>
          <h4 class="font-semibold mt-3">Disadvantages</h4>
          <ul class="list-disc pl-6">
            <li>Slower than switches</li>
            <li>Limited ports</li>
          </ul>
          `
        ]
      },
      {
        id: 'introduction-to-firewalls',
        title: 'Introduction to Firewalls',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Introduction to Firewalls</h2>
          <p>A firewall is a security device/software that monitors and controls incoming/outgoing traffic using defined security rules.</p>
          <h4 class="font-semibold mt-3">Purpose</h4>
          <ul class="list-disc pl-6">
            <li>Block unauthorized access</li>
            <li>Allow legitimate traffic</li>
            <li>Provide network security</li>
          </ul>
          <h4 class="font-semibold mt-3">When Introduced</h4>
          <p>Firewalls appeared in the early 1990s during the rise of internet threats.</p>
          <h4 class="font-semibold mt-3">Advantages</h4>
          <ul class="list-disc pl-6">
            <li>Protection from attacks</li>
            <li>Traffic monitoring</li>
            <li>Policy-based control</li>
            <li>Prevents malware spread</li>
          </ul>
          <h4 class="font-semibold mt-3">Disadvantages</h4>
          <ul class="list-disc pl-6">
            <li>Can block legitimate apps if misconfigured</li>
            <li>Does not fully protect against insider threats</li>
          </ul>
          <h4 class="font-semibold mt-3">Without Firewalls?</h4>
          <ul class="list-disc pl-6">
            <li>Open network exposed to attacks</li>
            <li>No traffic filtering</li>
            <li>Easy target for hackers</li>
          </ul>
          <h4 class="font-semibold mt-3">Alternatives</h4>
          <ul class="list-disc pl-6">
            <li>ACLs (Access Control Lists)</li>
            <li>IDS/IPS systems</li>
            <li>Security gateways</li>
          </ul>
          `
        ]
      },
      {
        id: 'types-of-firewalls',
        title: 'Types of Firewalls',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Types of Firewalls</h2>
          <h3 class="text-lg font-semibold mb-2">Packet Filtering Firewalls (Layer 3/4)</h3>
          <p class="mb-2">Filters traffic based on IP, port, protocol.</p>
          <h3 class="text-lg font-semibold mb-2">Stateful Firewalls</h3>
          <p class="mb-2">Tracks connections and ensures traffic is part of an existing session.</p>
          <h3 class="text-lg font-semibold mb-2">Proxy Firewalls</h3>
          <p class="mb-2">Acts as a middle-man and hides internal network details.</p>
          <h3 class="text-lg font-semibold mb-2">Next-Generation Firewalls (NGFW)</h3>
          <p class="mb-2">Includes deep packet inspection, anti-malware, intrusion prevention.</p>
          <h3 class="text-lg font-semibold mb-2">Cloud Firewalls</h3>
          <p class="mb-2">Firewall services hosted on cloud environments (AWS, Azure).</p>
          `
        ]
      },
      {
        id: 'basic-firewall-rules-configuration',
        title: 'Basic Firewall Rules & Configuration',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Basic Firewall Rules & Configuration</h2>
          <h3 class="text-lg font-semibold mb-2">Firewall Rules Control</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Allowed IPs</li>
            <li>Allowed ports</li>
            <li>Denied IPs</li>
            <li>Traffic directions</li>
            <li>Protocol filtering</li>
            <li>Logging and monitoring</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Typical Rules</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Allow HTTP/HTTPS (80/443)</li>
            <li>Allow SSH (22)</li>
            <li>Block Telnet (23)</li>
            <li>Allow internal LAN traffic</li>
            <li>Block suspicious IPs</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Defines security boundaries</li>
            <li>Controls traffic precisely</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Too many rules cause confusion</li>
            <li>Wrong rule can cause outages</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Alternatives</h3>
          <ul class="list-disc pl-6">
            <li>ACLs</li>
            <li>Security groups (cloud)</li>
          </ul>
          `
        ]
      },
      {
        id: 'network-security-devices-overview',
        title: 'Overview of Network Security Devices',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">Overview of Network Security Devices</h2>
          <p class="mb-3">Network security devices protect networks from cyber attacks. They can be physical or software-based.</p>
          <h3 class="text-lg font-semibold mb-2">Key Devices</h3>
          <ul class="list-disc pl-6 mb-3">
            <li><strong>IDS (Intrusion Detection System):</strong> Detects suspicious activity but does not block it.</li>
            <li><strong>IPS (Intrusion Prevention System):</strong> Detects and blocks threats in real-time.</li>
            <li><strong>Proxy Servers:</strong> Hides user identity and filters internet access.</li>
            <li><strong>VPN Gateways:</strong> Encrypts traffic between networks/users.</li>
            <li><strong>Load Balancers:</strong> Distributes traffic evenly across servers.</li>
            <li><strong>DLP Systems:</strong> Prevents sensitive data leakage.</li>
            <li><strong>SIEM Systems:</strong> Collects logs for security monitoring and analysis.</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Advantages</h3>
          <ul class="list-disc pl-6 mb-3">
            <li>Strong security</li>
            <li>Advanced threat detection</li>
            <li>Prevents data leaks</li>
          </ul>
          <h3 class="text-lg font-semibold mb-2">Disadvantages</h3>
          <ul class="list-disc pl-6">
            <li>Expensive</li>
            <li>Complex setup</li>
            <li>Requires monitoring</li>
          </ul>
          `
        ]
      },
      {
        id: 'wireguard-openvpn-basics',
        title: 'WireGuard / OpenVPN Basic Configuration',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">✅ Topic 8: WireGuard / OpenVPN Basic Configuration</h2>
          <p class="mb-2">VPN technologies like WireGuard and OpenVPN provide secure, encrypted tunnels that allow remote users or branch offices to connect safely. WireGuard is modern, lightweight, and extremely fast compared to older VPN protocols. Setting up VPNs is essential for secure administration, remote work, and cross-network communication. Linux provides full tools for managing these VPNs, generating keys, configuring interfaces, and establishing encrypted tunnels.</p>

          <h3 class="text-lg font-semibold mb-2">WireGuard</h3>
          <pre class="p-3 rounded-lg border"><code>wg genkey | tee privatekey | wg pubkey &gt; publickey</code></pre>

          <pre class="p-3 rounded-lg border"><code>[Interface]
Address = 10.0.0.2/24
PrivateKey = &lt;private-key&gt;

[Peer]
PublicKey = &lt;server-public-key&gt;
Endpoint = vpn.yoursite.com:51820
AllowedIPs = 0.0.0.0/0</code></pre>
          <pre class="p-3 rounded-lg border"><code>wg-quick up wg0</code></pre>

          <h3 class="text-lg font-semibold mb-2">OpenVPN</h3>
          <pre class="p-3 rounded-lg border"><code>openvpn --config client.ovpn</code></pre>
          `
        ]
      },
      {
        id: 'firewalld-ufw-cli',
        title: 'FirewallD & UFW Management',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">✅ Topic 10: FirewallD & UFW Command-Line Management</h2>
          <p class="mb-2">Firewalls form the first line of defense in network security. On Linux, FirewallD and UFW provide simple yet powerful interfaces for controlling access to ports and services. With these tools, administrators can block malicious traffic, allow essential services, and implement security policies. Configuring firewall rules is a must-know skill for securing servers, preventing intrusions, and controlling network flow.</p>

          <h3 class="text-lg font-semibold mb-2">FirewallD</h3>
          <pre class="p-3 rounded-lg border"><code>systemctl status firewalld
firewall-cmd --add-port=80/tcp --permanent
firewall-cmd --reload</code></pre>

          <h3 class="text-lg font-semibold mb-2">UFW</h3>
          <pre class="p-3 rounded-lg border"><code>ufw enable
ufw allow 22
ufw deny 80</code></pre>
          `
        ]
      },
      {
        id: 'linux-network-logs',
        title: 'Linux Logs for Network Events',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">✅ Topic 11: Linux Logs for Network Events (syslog, journalctl)</h2>
          <p class="mb-2">Logs are critical for troubleshooting network errors, identifying failures, and detecting attacks. Linux stores almost every system and network event in log files, making it possible to trace DHCP failures, firewall blocks, and suspicious activities. Understanding how to read logs using journalctl and syslog is essential for system administrators, especially in production environments.</p>
          <h3 class="text-lg font-semibold mb-2">Practical Commands</h3>
          <pre class="p-3 rounded-lg border"><code>journalctl
journalctl -u NetworkManager
cat /var/log/syslog</code></pre>
          `
        ]
      },
      {
        id: 'wireshark-packet-types',
        title: 'Packet Types in Wireshark',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">✅ Topic 12: Packet Types in Wireshark (ICMP, DHCP, DNS, ARP, TLS)</h2>
          <p class="mb-2">Understanding packet types is essential for effective packet analysis and troubleshooting. Wireshark breaks down packets so you can see exactly how devices behave on the network. From simple pings (ICMP) to complex encrypted TLS traffic, each protocol provides hints about network performance, errors, or attacks. Mastering packet interpretation helps identify latency issues, DNS failures, ARP spoofing, and malicious patterns.</p>
          <ul class="list-disc pl-6 mb-3">
            <li>ICMP</li>
            <li>DHCP</li>
            <li>DNS</li>
            <li>ARP</li>
            <li>TCP/UDP</li>
            <li>TLS</li>
          </ul>
          `
        ]
      },
      {
        id: 'vlan-creation-linux',
        title: 'VLAN Creation & Management in Linux',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">✅ Topic 13: VLAN Creation & Management in Linux</h2>
          <p class="mb-2">VLANs allow you to logically segment a physical network into isolated environments. This improves security, reduces broadcast traffic, and organizes enterprise networks. Linux fully supports VLAN tagging using the ip command suite. Network engineers rely on VLANs to separate departments, secure servers, and manage traffic efficiently.</p>
          <h3 class="text-lg font-semibold mb-2">Practical Commands</h3>
          <pre class="p-3 rounded-lg border"><code>ip link add link eth0 name eth0.10 type vlan id 10
ip addr add 192.168.10.2/24 dev eth0.10
ip link set eth0.10 up</code></pre>
          `
        ]
      },
      {
        id: 'ssh-hardening',
        title: 'SSH Hardening & Remote Access Security',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">✅ Topic 14: SSH Hardening & Remote Access Security</h2>
          <p class="mb-2">SSH is the standard method for remotely accessing Linux servers, which makes it a popular target for attackers. Hardening SSH ensures attackers cannot brute-force or exploit weak configurations. Techniques such as disabling password authentication, using SSH keys, and restricting users significantly enhance server security. Every production server must follow SSH hardening guidelines.</p>
          <h3 class="text-lg font-semibold mb-2">Practical Commands</h3>
          <pre class="p-3 rounded-lg border"><code>PasswordAuthentication no
AllowUsers jashwanth
ssh-keygen
ssh-copy-id user@server</code></pre>
          `
        ]
      },
      {
        id: 'iperf3-network-performance',
        title: 'Network Performance Tools (iperf3)',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">✅ Topic 15: Network Performance Tools (iperf3)</h2>
          <p class="mb-2">Network performance testing is essential when diagnosing speed problems, validating WAN links, or verifying server throughput. iperf3 is a powerful tool for testing bandwidth, latency, jitter, and upload/download speeds between two devices. It is widely used in data centers, enterprise networks, and troubleshooting slow connections.</p>
          <h3 class="text-lg font-semibold mb-2">Practical Commands</h3>
          <pre class="p-3 rounded-lg border"><code>iperf3 -s
iperf3 -c 192.168.1.10
iperf3 -c IP -d
iperf3 -c IP -u</code></pre>
          `
        ]
      },
      {
        id: 'nmap-nse',
        title: 'Nmap Scripting Engine (NSE)',
        theoryPages: [
          `
          <h2 class="text-xl font-semibold mb-3">✅ Topic 9: Nmap NSE (Nmap Scripting Engine)</h2>
          <p class="mb-2">The Nmap Scripting Engine (NSE) adds powerful automation and vulnerability scanning capabilities to Nmap. It allows Nmap to check for weaknesses, misconfigurations, malware traces, authentication problems, and service details. NSE scripts cover everything from brute-force modules to malware detection and OS enumeration. Professionals rely heavily on NSE for penetration testing, real-time scanning, and automated discovery of vulnerabilities in networks.</p>
          <h3 class="text-lg font-semibold mb-2">Practical Commands</h3>
          <pre class="p-3 rounded-lg border"><code>nmap --script=vuln 192.168.1.10
nmap --script=auth 192.168.1.10
nmap --script=smb-os-discovery 192.168.1.10</code></pre>
          `
        ]
      }
    ]
  }
];

const TabButton: React.FC<{ label: string; active: boolean; onClick: () => void; isDark: boolean; disabled?: boolean } > = ({ label, active, onClick, isDark, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 font-medium transition-colors ${
      active
        ? 'border-b-2 border-blue-500 text-blue-600'
        : isDark
          ? 'text-gray-400 hover:text-white'
          : 'text-gray-600 hover:text-gray-900'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    aria-disabled={disabled ? true : undefined}
    title={disabled ? 'Disabled for this module' : undefined}
  >
    {label}
  </button>
);

const CourseLearningNetworkingBeginner: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const moduleData = useMemo(() => MODULES.find(m => m.id === slug) || MODULES[0], [slug]);
  const [activeTopicId, setActiveTopicId] = useState<string>(moduleData.topics[0]?.id || 'osi-model');
  const activeTopic = useMemo(() => moduleData.topics.find(t => t.id === activeTopicId) || moduleData.topics[0], [moduleData, activeTopicId]);

  const [activeTab, setActiveTab] = useState<'theory' | 'syntax' | 'terminal'>('theory');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const totalPages = activeTopic.theoryPages.length;

  // Date & Time
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentModuleIndex = useMemo(() => MODULES.findIndex(m => m.id === (slug || MODULES[0].id)), [slug]);
  const nextModule = currentModuleIndex >= 0 && currentModuleIndex < MODULES.length - 1 ? MODULES[currentModuleIndex + 1] : undefined;
  const prevModule = currentModuleIndex > 0 ? MODULES[currentModuleIndex - 1] : undefined;

  const isModule2 = moduleData.id === 'module-2';
  useEffect(() => {
    if (isModule2 && activeTab === 'syntax') {
      setActiveTab('theory');
    }
  }, [isModule2, activeTab]);

  // Chat state (mock LLM replies)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  // Replace mock generator with backend call
  const sendChat = async (text: string) => {
    const userMsg = { role: 'user', content: text } as ChatMessage;
    setChatMessages(prev => [...prev, userMsg]);
    setChatLoading(true);
    try {
      const answer = await askLLM(text, [...chatMessages, userMsg]);
      setChatMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I could not reach the assistant. Please try again.' }]);
      console.error('Chat error:', err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <main className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`} style={isDark ? { backgroundImage: "url('/img/bg.png')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } : undefined}>
      <div className="flex min-h-screen pt-24">
        {/* Sidebar */}
        <aside className={`${isDark ? 'bg-black border-gray-700' : 'bg-[#FDF7EC] border-gray-200'} border-r w-80 p-4`}> 
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/networking-beginner')}
              className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors text-sm`}
              aria-label="Back to portal"
            >
              Back to Portal
            </button>
          </div>
          <h2 className="text-sm font-semibold mb-3">{moduleData.title}</h2>
          <ul className="space-y-2">
            {moduleData.topics.map((t, idx) => (
              <li key={t.id}>
                <button
                  onClick={() => { setActiveTopicId(t.id); setCurrentPageIndex(0); setActiveTab('theory'); }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    t.id === activeTopicId
                      ? (isDark ? 'bg-black text-white' : 'bg-[#14A38F] text-white')
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-[#F3EAD7]'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`${t.id === activeTopicId ? (isDark ? 'bg-black text-white' : 'bg-[#14A38F] text-white') : (isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700')} w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs opacity-75">Lesson {idx + 1}</div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar: Tabs + Date/Time (buttons moved to dock) */}
          <div className={`border-b ${isDark ? 'border-gray-700 bg-black/80' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between px-3">
              <div className="flex">
                <TabButton label="Lesson" active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} isDark={isDark} />
                <TabButton label="Syntax" active={activeTab === 'syntax'} onClick={() => setActiveTab('syntax')} isDark={isDark} disabled={isModule2} />
                <TabButton label="Terminal" active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} isDark={isDark} />
              </div>
              <div className="flex items-center gap-3">
                <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{now.toLocaleDateString()} {now.toLocaleTimeString()}</div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {activeTab !== 'terminal' ? (
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  {activeTab === 'theory' && (
                    <div className={`${isDark ? 'bg-black border-white/15' : 'bg-white border-gray-200'} rounded-xl border p-6 shadow-lg`}>
                      <div className="prose dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: activeTopic.theoryPages[currentPageIndex] }} />
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <button
                          onClick={() => setCurrentPageIndex((i) => Math.max(0, i - 1))}
                          disabled={currentPageIndex === 0}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition ${currentPageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${isDark ? 'bg-white/10 hover:bg-white/15 text-white border-white/20' : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'}`}
                        >
                          Previous
                        </button>
                        <div className="text-sm opacity-70">Page {currentPageIndex + 1} of {totalPages}</div>
                        <button
                          onClick={() => setCurrentPageIndex((i) => Math.min(totalPages - 1, i + 1))}
                          disabled={currentPageIndex >= totalPages - 1}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition ${currentPageIndex >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''} ${isDark ? 'bg-white/10 hover:bg-white/15 text-white border-white/20' : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300'}`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'syntax' && (
                    activeTopicId === 'routers-switches-access-points' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Router, Switch, AP — Syntax</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">Router (Cisco CLI)</h4>
                            <pre className="p-3 rounded-lg border"><code>enable
configure terminal
ip route &lt;network&gt; &lt;mask&gt; &lt;next-hop&gt;
show ip route</code></pre>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">Switch (VLAN Example)</h4>
                            <pre className="p-3 rounded-lg border"><code>enable
configure terminal
vlan 10
name SALES
switchport access vlan 10</code></pre>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">Access Point (SSID Setup)</h4>
                            <pre className="p-3 rounded-lg border"><code>configure terminal
dot11 ssid OFFICE_WIFI
authentication open</code></pre>
                          </div>
                        </div>
                      </div>
                    ) : activeTopicId === 'modems-hubs-repeaters-bridges' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Layer 1–2 Devices — Syntax</h3>
                        <p>No configuration syntax required; basic show commands:</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <pre className="p-3 rounded-lg border"><code>show interfaces
show controllers</code></pre>
                          </div>
                        </div>
                      </div>
                    ) : activeTopicId === 'introduction-to-firewalls' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Firewall Rule Format</h3>
                        <pre className="p-3 rounded-lg border"><code># allow &lt;port&gt; &lt;protocol&gt; &lt;source&gt; &lt;destination&gt;
# deny  &lt;port&gt; &lt;protocol&gt; &lt;source&gt; &lt;destination&gt;</code></pre>
                      </div>
                    ) : activeTopicId === 'types-of-firewalls' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Firewall ACL Syntax (Cisco)</h3>
                        <pre className="p-3 rounded-lg border"><code>access-list 101 permit tcp any host 192.168.1.10 eq 80
access-list 101 deny ip any any</code></pre>
                      </div>
                    ) : activeTopicId === 'basic-firewall-rules-configuration' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">UFW & iptables Basics</h3>
                        <pre className="p-3 rounded-lg border"><code>sudo ufw allow &lt;port&gt;/&lt;protocol&gt;
sudo ufw deny &lt;port&gt;/&lt;protocol&gt;
iptables -A INPUT -p tcp --dport 80 -j ACCEPT</code></pre>
                      </div>
                    ) : activeTopicId === 'network-security-devices-overview' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Security Device Show Commands</h3>
                        <pre className="p-3 rounded-lg border"><code>show security status
show intrusion-detection
# VPN configuration depends on vendor</code></pre>
                      </div>
                    ) : activeTopicId === 'tcpip-model' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">TCP/IP Layer Commands</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border rounded-lg">
                            <thead>
                              <tr>
                                <th className="text-left p-2 border">Task</th>
                                <th className="text-left p-2 border">Command</th>
                                <th className="text-left p-2 border">Layer</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="p-2 border">Check link status</td>
                                <td className="p-2 border"><code>ip link</code>, <code>ifconfig</code></td>
                                <td className="p-2 border">Network Interface</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">Check IP address</td>
                                <td className="p-2 border"><code>ip addr</code>, <code>ipconfig</code></td>
                                <td className="p-2 border">Internet</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">Check routing</td>
                                <td className="p-2 border"><code>ip route</code>, <code>traceroute</code></td>
                                <td className="p-2 border">Internet</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">View TCP/UDP ports</td>
                                <td className="p-2 border"><code>netstat -tulpn</code></td>
                                <td className="p-2 border">Transport</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">Test a web service</td>
                                <td className="p-2 border"><code>curl http://example.com</code></td>
                                <td className="p-2 border">Application</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : activeTopicId === 'tcpip-ip-addressing' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">IP Addressing Commands</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border rounded-lg">
                            <thead>
                              <tr>
                                <th className="text-left p-2 border">Task</th>
                                <th className="text-left p-2 border">Command</th>
                                <th className="text-left p-2 border">Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="p-2 border">Show IP Address</td>
                                <td className="p-2 border"><code>ip addr</code>, <code>ifconfig</code>, <code>ipconfig</code> (Windows)</td>
                                <td className="p-2 border">IPv4/IPv6 interface details</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">Test IP Connectivity</td>
                                <td className="p-2 border"><code>ping &lt;ip-address&gt;</code></td>
                                <td className="p-2 border">ICMP echo to host</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">View Routing (IP-Based)</td>
                                <td className="p-2 border"><code>ip route</code>, <code>route -n</code></td>
                                <td className="p-2 border">Kernel routing table</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">View IPv6 Address</td>
                                <td className="p-2 border"><code>ip -6 addr</code>, <code>ifconfig</code></td>
                                <td className="p-2 border">IPv6 interfaces</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">Enable/Disable Interface</td>
                                <td className="p-2 border"><code>ip link set eth0 up</code> / <code>down</code></td>
                                <td className="p-2 border">Replace <code>eth0</code> as needed</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : activeTopicId === 'tcp-vs-udp' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">TCP vs UDP â€“ Syntax</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">TCP handshake</h4>
                            <pre className="p-3 rounded-lg border"><code>SYN â†’ SYN-ACK â†’ ACK</code></pre>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">UDP communication</h4>
                            <pre className="p-3 rounded-lg border"><code>send(packet_without_connection)</code></pre>
                          </div>
                        </div>
                      </div>
                    ) : activeTopicId === 'intro-network-scanning' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Scanning Basics â€” Syntax</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">Basic invocation</h4>
                            <pre className="p-3 rounded-lg border"><code>nmap [options] &lt;target-spec&gt;</code></pre>
                            <h4 className="text-md font-semibold mt-3">Target specification</h4>
                            <ul className="list-disc pl-6">
                              <li>Single IP: <code>192.168.1.10</code></li>
                              <li>CIDR: <code>192.168.1.0/24</code></li>
                              <li>Range: <code>192.168.1.1-50</code></li>
                              <li>Hostname: <code>example.local</code></li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">Key options overview</h4>
                            <ul className="list-disc pl-6">
                              <li><code>-sS</code> / <code>-sT</code> / <code>-sU</code> â€” SYN / connect / UDP scans</li>
                              <li><code>-sn</code> â€” host discovery only (no port scan)</li>
                              <li><code>-p</code> â€” ports (lists/ranges/`-p-`)</li>
                              <li><code>-A</code> / <code>-sV</code> / <code>-O</code> â€” aggressive, service, OS</li>
                              <li><code>-T0..-T5</code> â€” timing templates (slow â†’ aggressive)</li>
                              <li><code>-oN</code> / <code>-oX</code> / <code>-oG</code> â€” output formats</li>
                              <li><code>--script</code> â€” NSE scripting</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : activeTopicId === 'intro-network-scanning' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Introduction — Safe Terminal Examples</h4>
                          <p className="text-sm">Run only in your lab network or on hosts you control.</p>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>
                              Ping-like host discovery (no port scan)
                              <pre className="p-3 rounded-lg border"><code>nmap -sn 192.168.1.0/24</code></pre>
                            </li>
                            <li>
                              Simple TCP connect scan (non-root)
                              <pre className="p-3 rounded-lg border"><code>nmap -sT 192.168.1.10</code></pre>
                            </li>
                            <li>
                              Basic port scan (common ports)
                              <pre className="p-3 rounded-lg border"><code>nmap -p 22,80,443 192.168.1.10</code></pre>
                            </li>
                          </ol>
                          <p className="text-xs opacity-80">Note: open port ≠ vulnerability; follow with enumeration and analysis.</p>
                        </div>
                      ) : activeTopicId === 'port-scanning-host-discovery' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Host Discovery & Port Selection</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">Host discovery flags</h4>
                            <ul className="list-disc pl-6">
                              <li><code>-sn</code> — ping scan (no port scan), discovers hosts only.</li>
                              <li><code>-Pn</code> — treat all hosts as online (skip host discovery).</li>
                              <li><code>-PS</code> / <code>-PA</code> / <code>-PU</code> — TCP SYN / ACK / UDP probes to specified ports (e.g., <code>-PS22,443</code>).</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">Port selection</h4>
                            <ul className="list-disc pl-6">
                              <li><code>-p 1-65535</code> — scan full range.</li>
                              <li><code>-p 80,443,8080</code> — specific ports separated by commas.</li>
                              <li><code>-p-</code> — shorthand for 1–65535.</li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-md font-semibold">Port scan timing</h4>
                          <ul className="list-disc pl-6">
                            <li><code>-T0</code> through <code>-T5</code> — slow to aggressive; <code>-T4</code> common on LAN, <code>-T5</code> is noisy.</li>
                          </ul>
                        </div>
                      </div>
                    ) : activeTopicId === 'nmap-commands' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Nmap Syntax — Extended & Categorized</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">Basic invocation</h4>
                            <pre className="p-3 rounded-lg border"><code>nmap &lt;targets&gt;</code></pre>
                            <h4 className="text-md font-semibold mt-3">Common scan types</h4>
                            <ul className="list-disc pl-6">
                              <li><code>-sS</code> â€” TCP SYN (stealthy, default as root)</li>
                              <li><code>-sT</code> â€” TCP connect (non-root)</li>
                              <li><code>-sU</code> â€” UDP scan</li>
                              <li><code>-sA</code> â€” ACK scan (map firewall rules)</li>
                              <li><code>-sN</code>, <code>-sF</code>, <code>-sX</code> â€” Null/FIN/Xmas (older stealth)</li>
                              <li><code>-sV</code> â€” service/version detection</li>
                              <li><code>-O</code> â€” OS detection</li>
                              <li><code>-A</code> â€” aggressive: <code>-sV -O --script=default</code></li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">Output options</h4>
                            <ul className="list-disc pl-6">
                              <li><code>-oN</code> normal.txt â€” normal output</li>
                              <li><code>-oX</code> xml.xml â€” XML</li>
                              <li><code>-oG</code> grepable.gnmap â€” grepable</li>
                              <li><code>-oA</code> base â€” all three formats</li>
                            </ul>
                            <h4 className="text-md font-semibold mt-3">Scripting engine</h4>
                            <ul className="list-disc pl-6">
                              <li><code>--script &lt;name&gt;</code> â€” e.g., <code>--script http-enum</code></li>
                              <li><code>--script-args</code> â€” pass arguments to scripts</li>
                            </ul>
                            <h4 className="text-md font-semibold mt-3">Timing & performance</h4>
                            <ul className="list-disc pl-6">
                              <li><code>-T0</code> (paranoid) â†’ <code>-T5</code> (insane)</li>
                              <li><code>--min-rate NUM</code> â€” minimum packets/sec</li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-md font-semibold">Scan example</h4>
                          <pre className="p-3 rounded-lg border"><code>nmap -sS -sV -p 1-1000 -T4 target</code></pre>
                        </div>
                      </div>
                    ) : activeTopicId === 'scanning-techniques' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">SYN & UDP Scans â€” Syntax</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">SYN scan</h4>
                            <pre className="p-3 rounded-lg border"><code>sudo nmap -sS -p 1-1000 -T4 192.168.1.10</code></pre>
                            <ul className="list-disc pl-6">
                              <li><code>-sS</code> â€” SYN</li>
                              <li><code>-p</code> â€” port range</li>
                              <li><code>-T4</code> â€” faster timing (LAN)</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">UDP scan</h4>
                            <pre className="p-3 rounded-lg border"><code>sudo nmap -sU -p 53,161 192.168.1.10</code></pre>
                            <p className="text-sm">UDP scanning is slow; scan fewer ports or use <code>--top-ports</code>.</p>
                          </div>
                        </div>
                        <div className="mt-4 grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">Combined TCP+UDP</h4>
                            <pre className="p-3 rounded-lg border"><code>sudo nmap -sS -sU -p T:1-200,U:53,161 192.168.1.10</code></pre>
                            <p className="text-sm">Use <code>T:</code> and <code>U:</code> prefixes for per-protocol port lists.</p>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">Tuning</h4>
                            <ul className="list-disc pl-6">
                              <li><code>--max-retries</code>, <code>--host-timeout</code></li>
                              <li><code>--min-rate</code>, <code>--max-rate</code></li>
                            </ul>
                            <p className="text-xs opacity-80">Use in lab after teaching basics.</p>
                          </div>
                        </div>
                      </div>
                    ) : activeTopicId === 'detect-services-os' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Service & OS Detection â€” Syntax</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">Service detection</h4>
                            <pre className="p-3 rounded-lg border"><code>nmap -sV 192.168.1.10</code></pre>
                            <pre className="p-3 rounded-lg border"><code>nmap -sV --version-intensity 9 192.168.1.10</code></pre>
                            <p className="text-sm"><code>--version-intensity &lt;0-9&gt;</code>: 0 (light) to 9 (aggressive) probing.</p>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">OS detection</h4>
                            <pre className="p-3 rounded-lg border"><code>sudo nmap -O 192.168.1.10</code></pre>
                            <pre className="p-3 rounded-lg border"><code>sudo nmap -O --osscan-guess 192.168.1.10</code></pre>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-md font-semibold">Combined aggressive detection</h4>
                          <pre className="p-3 rounded-lg border"><code>sudo nmap -sS -sV -O --script=banner 192.168.1.10</code></pre>
                          <p className="text-xs opacity-80"><code>--script=banner</code> attempts banner grabbing; caution in production.</p>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-md font-semibold">NSE scripts for service checks</h4>
                          <ul className="list-disc pl-6">
                            <li><code>--script=http-enum</code> â€” enumerate common HTTP paths</li>
                            <li><code>--script=ssl-cert</code> - retrieve certificate details</li>
                          </ul>
                        </div>
                      </div>
                    ) : activeTopicId === 'analyzing-tcp-udp-traffic' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">TCP/UDP Analysis â€” Syntax</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">TCP filters</h4>
                            <pre className="p-3 rounded-lg border"><code>tcp.flags.syn == 1
tcp.flags.ack == 1
tcp.analysis.retransmission
tcp.stream == 0</code></pre>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">UDP filters</h4>
                            <pre className="p-3 rounded-lg border"><code>udp.port == 53
udp.length &gt; 100</code></pre>
                          </div>
                        </div>
                      </div>
                    ) : activeTopicId === 'detect-network-issues-wireshark' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Troubleshooting Filters â€” Syntax</h3>
                        <pre className="p-3 rounded-lg border"><code>tcp.analysis.lost_segment
tcp.analysis.retransmission
icmp
dns
bootp</code></pre>
                      </div>
                    ) : activeTopicId === 'intro-packet-capturing' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Wireshark Display Filters â€” Syntax</h3>
                        <p>Wireshark uses <strong>Display Filters</strong> to narrow packets after capture.</p>
                        <pre className="p-3 rounded-lg border"><code>protocol.field operator value
# Examples
ip.src == 192.168.1.10
tcp.port == 80
dns</code></pre>
                        <p className="mt-2 text-sm text-muted-foreground">Tip: Use the filter bar in Wireshark to apply display filters; capture filters are set before capture.</p>
                      </div>
                    ) : activeTopicId === 'frames-packets-segments' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Layered Views â€” Syntax</h3>
                        <p>Core filter names to view different layers/components:</p>
                        <ul>
                          <li><code>frame</code></li>
                          <li><code>ip</code></li>
                          <li><code>tcp</code></li>
                          <li><code>udp</code></li>
                        </ul>
                        <p className="mt-2 text-sm text-muted-foreground">Expand the packet details pane to see Frame, IP Packet, and TCP/UDP Segment breakdowns.</p>
                      </div>
                    ) : activeTopicId === 'traffic-filtering' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Common Filters â€” Syntax</h3>
                        <h4 className="text-md font-semibold">IP</h4>
                        <pre className="p-3 rounded-lg border"><code>ip.addr == 192.168.1.10
ip.src == 10.0.0.1
ip.dst == 8.8.8.8</code></pre>
                        <h4 className="text-md font-semibold">TCP</h4>
                        <pre className="p-3 rounded-lg border"><code>tcp.port == 443
tcp.flags.syn == 1
tcp.analysis.retransmission</code></pre>
                        <h4 className="text-md font-semibold">UDP</h4>
                        <pre className="p-3 rounded-lg border"><code>udp.port == 53</code></pre>
                        <h4 className="text-md font-semibold">DNS</h4>
                        <pre className="p-3 rounded-lg border"><code>dns</code></pre>
                        <h4 className="text-md font-semibold">HTTP</h4>
                        <pre className="p-3 rounded-lg border"><code>http.request</code></pre>
                        <p className="mt-2 text-sm text-muted-foreground">Use capture filters before capture (BPF) and display filters after capture.</p>
                      </div>
                    ) : activeTopicId === 'ping-traceroute-netstat-ipconfig' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Ping / Traceroute / Netstat / Ipconfig â€” Syntax</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">PING</h4>
                            <pre className="p-3 rounded-lg border"><code>ping &lt;IP/domain&gt;</code></pre>
                            <h4 className="text-md font-semibold mt-3">TRACERT / TRACEROUTE</h4>
                            <pre className="p-3 rounded-lg border"><code>tracert &lt;domain&gt;     (Windows)
traceroute &lt;domain&gt;  (Linux)</code></pre>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">NETSTAT</h4>
                            <pre className="p-3 rounded-lg border"><code>netstat -a
netstat -tulpn
netstat -s</code></pre>
                            <h4 className="text-md font-semibold mt-3">IPCONFIG / IFCONFIG</h4>
                            <pre className="p-3 rounded-lg border"><code>ipconfig /all
ifconfig</code></pre>
                          </div>
                        </div>
                      </div>
                    ) : activeTopicId === 'connectivity-issues' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Connectivity â€” Syntax</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">Reachability & DNS</h4>
                            <pre className="p-3 rounded-lg border"><code>ping &lt;gateway&gt;
ping &lt;dns&gt;
tracert 8.8.8.8</code></pre>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">Renew & Inspect</h4>
                            <pre className="p-3 rounded-lg border"><code>ipconfig /renew
route print
arp -a</code></pre>
                          </div>
                        </div>
                      </div>
                    ) : activeTopicId === 'dns-routing-problems' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">DNS & Routing â€” Syntax</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-md font-semibold">DNS Diagnosis</h4>
                            <pre className="p-3 rounded-lg border"><code>nslookup &lt;domain&gt;
dig &lt;domain&gt;  (Linux)
ipconfig /flushdns  (Windows)</code></pre>
                          </div>
                          <div>
                            <h4 className="text-md font-semibold">Routing Diagnosis</h4>
                            <pre className="p-3 rounded-lg border"><code>route print
ip route
tracert &lt;destination&gt;
traceroute &lt;destination&gt;</code></pre>
                          </div>
                        </div>
                      </div>
                    ) : activeTopicId === 'troubleshooting-tools-best-practices' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Troubleshooting Tools â€” Syntax</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <pre className="p-3 rounded-lg border"><code>ping &lt;IP&gt;
nslookup &lt;domain&gt;
traceroute &lt;IP&gt;</code></pre>
                          </div>
                          <div>
                            <pre className="p-3 rounded-lg border"><code>netstat -tulpn
tcpdump -i eth0
ipconfig /all</code></pre>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="prose dark:prose-invert max-w-none">
                        <h3 className="text-lg font-semibold">Commands Mapped to OSI Layers</h3>
                        {/* existing syntax table remains unchanged */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full border rounded-lg">
                            <thead>
                              <tr>
                                <th className="text-left p-2 border">Task</th>
                                <th className="text-left p-2 border">Command</th>
                                <th className="text-left p-2 border">Layer</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="p-2 border">Check physical connection</td>
                                <td className="p-2 border"><code>ping</code> / link lights</td>
                                <td className="p-2 border">Layer 1</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">Check MAC info</td>
                                <td className="p-2 border"><code>ipconfig /all</code> (Windows) / <code>ifconfig</code> (Unix)</td>
                                <td className="p-2 border">Layer 2</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">View IP & routing</td>
                                <td className="p-2 border"><code>ip route</code>, <code>traceroute</code> / <code>tracert</code></td>
                                <td className="p-2 border">Layer 3</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">TCP/UDP ports</td>
                                <td className="p-2 border"><code>netstat -an</code></td>
                                <td className="p-2 border">Layer 4</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">Session info</td>
                                <td className="p-2 border"><code>netstat</code></td>
                                <td className="p-2 border">Layer 5</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">SSL/TLS check</td>
                                <td className="p-2 border"><code>openssl s_client</code></td>
                                <td className="p-2 border">Layer 6</td>
                              </tr>
                              <tr>
                                <td className="p-2 border">Application protocols</td>
                                <td className="p-2 border"><code>curl</code>, <code>ftp</code>, <code>nslookup</code></td>
                                <td className="p-2 border">Layer 7</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <ChatPanel isDark={isDark} messages={chatMessages} loading={chatLoading} onSend={sendChat} />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-2">Online Linux Terminal</h3>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className={`flex-1 rounded-lg border overflow-hidden ${isDark ? 'border-white/20' : 'border-gray-300'}`}>
                    <iframe
                      src="https://copy.sh/v86/?profile=archlinux"
                      title="Online Linux Terminal"
                      className="w-full h-[700px]"
                      loading="lazy"
                    />
                  </div>
                  <aside className={`${isDark ? 'bg-white/10 border-white/20 backdrop-blur-xl' : 'bg-white/60 border-gray-300/40 backdrop-blur-xl'} w-[520px] h-[640px] rounded-2xl border p-4 flex flex-col shadow-xl`}
                    >
                    <div className="space-y-4">
                      {activeTopicId === 'routers-switches-access-points' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Routers, Switches, Access Points — Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>IP interfaces summary: <code>show ip interface brief</code></li>
                            <li>Switch MAC table: <code>show mac address-table</code></li>
                            <li>Ping gateway: <code>ping 192.168.1.1</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'modems-hubs-repeaters-bridges' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Modems, Hubs, Repeaters, Bridges — Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>Interfaces status: <code>show interfaces status</code></li>
                            <li>ARP table: <code>show arp</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'introduction-to-firewalls' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Firewall — Terminal (UFW)</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>Status: <code>sudo ufw status</code></li>
                            <li>Enable: <code>sudo ufw enable</code></li>
                            <li>Allow SSH: <code>sudo ufw allow 22/tcp</code></li>
                            <li>Deny Telnet: <code>sudo ufw deny 23/tcp</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'types-of-firewalls' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Firewall — Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>Allow HTTPS: <code>sudo ufw allow 443/tcp</code></li>
                            <li>Deny FTP control: <code>sudo ufw deny 21/tcp</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'basic-firewall-rules-configuration' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Firewall Rules — Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>Allow app port: <code>sudo ufw allow 8080/tcp</code></li>
                            <li>Deny SMTP: <code>sudo ufw deny 25/tcp</code></li>
                            <li>List rules: <code>iptables -L</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'network-security-devices-overview' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Security Devices — Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>Service status: <code>sudo systemctl status ssh</code></li>
                            <li>Packet capture: <code>sudo tcpdump -i eth0</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'tcp-vs-udp' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">TCP vs UDP â€“ Terminal Exercises</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>List active TCP connections: <code>netstat -t</code></li>
                            <li>List active UDP connections: <code>netstat -u</code></li>
                            <li>Test TCP connection: <code>telnet google.com 80</code></li>
                            <li>Send UDP packets: <code>nc -u 127.0.0.1 5000</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'mac-arp-dns-dhcp' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">MAC / ARP / DNS / DHCP â€“ Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>View MAC address (Windows): <code>ipconfig /all</code></li>
                            <li>See ARP table: <code>arp -a</code></li>
                            <li>DNS lookup: <code>nslookup google.com</code></li>
                            <li>Renew IP (Windows): <code>ipconfig /renew</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'basic-protocols' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">HTTP/HTTPS â€“ Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>Check HTTP headers: <code>curl -I http://example.com</code></li>
                            <li>Check HTTPS: <code>curl -I https://example.com</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'topologies-architecture' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Topologies & Architecture â€“ Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>Check active connections: <code>netstat -an</code></li>
                            <li>Trace packet path: <code>tracert google.com</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'lan-wan-man-pan' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">LAN/WAN/MAN/PAN â€“ Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>See network interfaces (Windows): <code>ipconfig</code></li>
                            <li>Check local routes (Windows): <code>route print</code></li>
                            <li>Find devices in LAN (ARP cache): <code>arp -a</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'ping-traceroute-netstat-ipconfig' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Ping/Traceroute/Netstat/Ipconfig â€” Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>Ping public host: <code>ping google.com</code></li>
                            <li>Trace path: <code>tracert yahoo.com</code></li>
                            <li>List ports/sockets: <code>netstat -tulpn</code></li>
                            <li>View IP details (Windows): <code>ipconfig /all</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'connectivity-issues' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Connectivity â€” Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>Ping gateway: <code>ping 192.168.1.1</code></li>
                            <li>Ping public DNS: <code>ping 8.8.8.8</code></li>
                            <li>Release IP (Windows): <code>ipconfig /release</code></li>
                            <li>Renew IP (Windows): <code>ipconfig /renew</code></li>
                            <li>View ARP table: <code>arp -a</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'dns-routing-problems' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">DNS & Routing â€” Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>DNS lookup: <code>nslookup google.com</code></li>
                            <li>Flush DNS cache (Windows): <code>ipconfig /flushdns</code></li>
                            <li>Print routes: <code>route print</code></li>
                            <li>Trace path: <code>traceroute 1.1.1.1</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'troubleshooting-tools-best-practices' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Troubleshooting Tools â€” Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>Connectivity check: <code>ping 1.1.1.1</code></li>
                            <li>DNS resolution: <code>nslookup instagram.com</code></li>
                            <li>Trace route: <code>traceroute 8.8.8.8</code></li>
                            <li>List connections: <code>netstat -a</code></li>
                            <li>Capture on Wi‑Fi: <code>tcpdump -i wlan0</code></li>
                          </ol>
                        </div>
                      ) : activeTopicId === 'port-scanning-host-discovery' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Host Discovery & Port Scanning â€” Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>
                              ARP ping for local subnet:
                              <pre className="p-3 rounded-lg border"><code>sudo nmap -sn -PR 192.168.1.0/24</code></pre>
                              <p className="mt-1"><code>-PR</code> forces ARP discovery on LANs; fast and reliable. Shows MAC addresses.</p>
                            </li>
                            <li>
                              ICMP + TCP host discovery:
                              <pre className="p-3 rounded-lg border"><code>sudo nmap -sn -PE -PS22,80 192.168.1.0/24</code></pre>
                              <p className="mt-1"><code>-PE</code> (ICMP echo), <code>-PS</code> (TCP SYN to ports 22 & 80).</p>
                            </li>
                            <li>
                              Scan all TCP ports on a host:
                              <pre className="p-3 rounded-lg border"><code>sudo nmap -p- 192.168.1.10</code></pre>
                            </li>
                            <li>
                              Quick scan of common ports:
                              <pre className="p-3 rounded-lg border"><code>nmap --top-ports 1000 192.168.1.10</code></pre>
                            </li>
                          </ol>
                          <p className="text-sm">Explain output in class: which hosts are up, which ports are shown, and what <em>filtered</em> means.</p>
                          <p className="text-xs opacity-80">Always run on lab networks.</p>
                        </div>
                      ) : activeTopicId === 'nmap-commands' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Nmap â€” Example Command & Interpretation</h4>
                          <pre className="p-3 rounded-lg border"><code>sudo nmap -sS --top-ports 100 -sV 192.168.1.10</code></pre>
                          <ul className="list-disc ml-5 space-y-2 text-sm">
                            <li><code>-sS</code>: TCP SYN (stealth) â€” privileged packet crafting.</li>
                            <li><code>--top-ports 100</code>: scan the most common 100 ports.</li>
                            <li><code>-sV</code>: service/version detection.</li>
                            <li>Root is needed for SYN scans; otherwise use <code>-sT</code>.</li>
                          </ul>
                          <p className="text-xs opacity-80">Use only in a closed lab environment.</p>
                        </div>
                      ) : activeTopicId === 'scanning-techniques' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">SYN & UDP Scans â€” Terminal</h4>
                          <p className="text-sm">Lab environment only. Expect delays with UDP scans.</p>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>
                              SYN scan of typical ports
                              <pre className="p-3 rounded-lg border"><code>sudo nmap -sS -p 22,80,443 -T4 192.168.1.10</code></pre>
                              <p className="mt-1">Expect quick SYNâ†’SYN/ACK shows open; RST returned by Nmap to abort.</p>
                            </li>
                            <li>
                              UDP scan of DNS & SNMP
                              <pre className="p-3 rounded-lg border"><code>sudo nmap -sU -p 53,161 192.168.1.10</code></pre>
                              <p className="mt-1">May take longer; closed ports yield ICMP unreachable; open may be silent or respond.</p>
                            </li>
                            <li>
                              Combined quick scan
                              <pre className="p-3 rounded-lg border"><code>sudo nmap -sS -sU --top-ports 100 -T3 192.168.1.0/28</code></pre>
                              <p className="mt-1">Use lower timing (<code>T3</code>) for mixed scans to reduce false positives.</p>
                            </li>
                            <li>
                              Measure scan time & performance
                              <pre className="p-3 rounded-lg border"><code>time sudo nmap -sU -p 1-200 192.168.1.10</code></pre>
                              <p className="mt-1">Compare to TCP scan to illustrate UDP slowness.</p>
                            </li>
                          </ol>
                          <p className="text-xs opacity-80">Discuss interpreting results: <em>open</em> vs <em>filtered</em>; why UDP may show <em>open|filtered</em>.</p>
                        </div>
                      ) : activeTopicId === 'detect-services-os' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Service & OS Detection â€” Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>
                              Service detection
                              <pre className="p-3 rounded-lg border"><code>nmap -sV 192.168.1.10</code></pre>
                              <p className="mt-1">Increase intensity if needed: <code>--version-intensity 9</code> (aggressive).</p>
                            </li>
                            <li>
                              OS fingerprinting
                              <pre className="p-3 rounded-lg border"><code>sudo nmap -O 192.168.1.10</code></pre>
                              <p className="mt-1">Add <code>--osscan-guess</code> to present best guess when confidence is low.</p>
                            </li>
                            <li>
                              Combined aggressive detection
                              <pre className="p-3 rounded-lg border"><code>sudo nmap -sS -sV -O --script=banner 192.168.1.10</code></pre>
                              <p className="mt-1"><code>--script=banner</code> attempts banner grabbing; caution in production.</p>
                            </li>
                            <li>
                              NSE service scripts
                              <pre className="p-3 rounded-lg border"><code>nmap --script=http-enum 192.168.1.10</code></pre>
                              <pre className="p-3 rounded-lg border"><code>nmap --script=ssl-cert -p 443 192.168.1.10</code></pre>
                            </li>
                          </ol>
                          <p className="text-xs opacity-80">Ethics: Only run detection in allowed scope; probes can trigger alarms.</p>
                        </div>
                      ) : activeTopicId === 'intro-packet-capturing' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Packet Capture â€” Terminal</h4>
                          <p className="text-sm">Wireshark GUI has no CLI; use TShark:</p>
                          <pre className="p-3 rounded-lg border"><code>tshark -i eth0</code></pre>
                          <p className="text-xs opacity-80">Use the correct interface (check with <code>tshark -D</code>).</p>
                        </div>
                      ) : activeTopicId === 'frames-packets-segments' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Verbose packet structure â€” Terminal</h4>
                          <pre className="p-3 rounded-lg border"><code>tshark -V -i wlan0</code></pre>
                          <p className="text-sm">Shows Frame (L2), Packet/IP (L3), Segment/TCP or UDP (L4) details.</p>
                        </div>
                      ) : activeTopicId === 'traffic-filtering' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Capture filter example â€” Terminal</h4>
                          <pre className="p-3 rounded-lg border"><code>tshark -i eth0 -f "port 80"</code></pre>
                          <p className="text-sm">Capture filter reduces what is saved; display filters narrow after capture.</p>
                        </div>
                      ) : activeTopicId === 'analyzing-tcp-udp-traffic' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">TCP/UDP Analysis â€” Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>
                              Capture only TCP
                              <pre className="p-3 rounded-lg border"><code>tshark -i eth0 -Y "tcp"</code></pre>
                            </li>
                            <li>
                              Show SYN/ACK handshake flags
                              <pre className="p-3 rounded-lg border"><code>tshark -i eth0 -Y "tcp.flags.syn==1 || tcp.flags.ack==1"</code></pre>
                            </li>
                            <li>
                              Follow first TCP stream
                              <pre className="p-3 rounded-lg border"><code>tshark -i eth0 -Y "tcp.stream == 0"</code></pre>
                            </li>
                            <li>
                              DNS over UDP
                              <pre className="p-3 rounded-lg border"><code>tshark -i eth0 -Y "udp.port==53"</code></pre>
                            </li>
                          </ol>
                          <p className="text-xs opacity-80">Use <code>tshark -D</code> to list interfaces; replace <code>eth0</code> accordingly.</p>
                        </div>
                      ) : activeTopicId === 'detect-network-issues-wireshark' ? (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold">Troubleshooting â€” Terminal</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>
                              Capture DNS errors
                              <pre className="p-3 rounded-lg border"><code>tshark -i eth0 -Y "dns and dns.flags.rcode != 0"</code></pre>
                            </li>
                            <li>
                              See TCP retransmissions (packet loss)
                              <pre className="p-3 rounded-lg border"><code>tshark -i eth0 -Y "tcp.analysis.retransmission"</code></pre>
                            </li>
                            <li>
                              ICMP unreachable / TTL exceeded
                              <pre className="p-3 rounded-lg border"><code>tshark -i eth0 -Y "icmp"</code></pre>
                            </li>
                            <li>
                              DHCP traffic
                              <pre className="p-3 rounded-lg border"><code>tshark -i eth0 -Y "bootp"</code></pre>
                            </li>
                          </ol>
                          <p className="text-xs opacity-80">For large captures, add time ranges: <code>-a duration:30</code> or use ring buffers.</p>
                        </div>
                      ) : (
                        <>
                          <h4 className="text-md font-semibold">Quick steps</h4>
                          <ol className="list-decimal ml-5 space-y-2 text-sm">
                            <li>Run <code>ip addr</code> to view IP addresses.</li>
                            <li>Ping a host: <code>ping google.com</code>.</li>
                            <li>Check routes: <code>ip route</code>.</li>
                            <li>Test HTTP: <code>curl -I https://example.com</code>.</li>
                          </ol>

                          <h4 className="text-md font-semibold">Downsides</h4>
                          <ul className="list-disc ml-5 space-y-2 text-sm">
                            <li>No persistence across sessions.</li>
                            <li>Limited privileges; <code>sudo</code> may be unavailable.</li>
                            <li>Network access might be restricted.</li>
                          </ul>

                          <h4 className="text-md font-semibold">Tips</h4>
                          <ul className="list-disc ml-5 space-y-2 text-sm">
                            <li>Use <code>ip -6 addr</code> for IPv6.</li>
                            <li>Combine commands with <code>&amp;&amp;</code> to chain tests.</li>
                            <li>Copy results into notes for later reference.</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </aside>
              </div>
              </div>
            )}
          </div>

          {/* Floating dock for Light/Dark and Module navigation */}
          <FloatingDock
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onPrevModule={() => prevModule && navigate(`/networking-beginner/module/${prevModule.id}`)}
            disabledPrev={!prevModule}
            onNextModule={() => nextModule && navigate(`/networking-beginner/module/${nextModule.id}`)}
            disabledNext={!nextModule}
            onHome={() => navigate('/student-portal')}
          />
        </div>
      </div>
    </main>
  );
};

export default CourseLearningNetworkingBeginner;


interface ChatMessage { role: 'user' | 'assistant'; content: string }

const FloatingDock: React.FC<{ isDark: boolean; onToggleTheme: () => void; onPrevModule: () => void; disabledPrev: boolean; onNextModule: () => void; disabledNext: boolean; onHome: () => void } > = ({ isDark, onToggleTheme, onPrevModule, disabledPrev, onNextModule, disabledNext, onHome }) => (
  <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 rounded-2xl shadow-lg border ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/60 border-gray-300/40'} backdrop-blur-xl px-3 py-2 flex items-center gap-2`} aria-label="Quick actions dock">
    <button
      onClick={onHome}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
      aria-label="Go to Student Portal"
      title="Student Portal"
    >
      <span className="inline-flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10.5L12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-9z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Home
      </span>
    </button>
    <div className="mx-1 h-6 w-px bg-gray-300/60 dark:bg-white/20" aria-hidden />
    <button
      onClick={onToggleTheme}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
    <button
      onClick={onPrevModule}
      disabled={disabledPrev}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${disabledPrev ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (isDark ? 'bg-black text-white hover:bg-gray-900' : 'bg-blue-600 text-white hover:bg-blue-500')}`}
      aria-label="Go to previous module"
    >
      Previous Module
    </button>
    <button
      onClick={onNextModule}
      disabled={disabledNext}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${disabledNext ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (isDark ? 'bg-black text-white hover:bg-gray-900' : 'bg-blue-600 text-white hover:bg-blue-500')}`}
      aria-label="Go to next module"
    >
      Next Module
    </button>
  </div>
);

const ChatPanel: React.FC<{ isDark: boolean; messages: ChatMessage[]; loading: boolean; onSend: (text: string) => void }> = ({ isDark, messages, loading, onSend }) => {
  const [text, setText] = React.useState('');

  // Typing animation state for the latest assistant message
  const [typingIndex, setTypingIndex] = React.useState<number | null>(null);
  const [typedContent, setTypedContent] = React.useState('');
  const typingTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!messages.length) return;
    const lastIndex = messages.length - 1;
    const last = messages[lastIndex];

    // Start typing animation only for the newest assistant message
    if (last.role === 'assistant') {
      // If already animating this message, skip
      if (typingIndex === lastIndex && typedContent.length === last.content.length) return;

      // Clear any previous timer
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }

      setTypingIndex(lastIndex);
      setTypedContent('');
      let i = 0;
      const full = last.content;
      const speedMs = 18; // smooth typing speed
      typingTimerRef.current = window.setInterval(() => {
        i = Math.min(i + 1, full.length);
        setTypedContent(full.slice(0, i));
        if (i >= full.length) {
          if (typingTimerRef.current) {
            window.clearInterval(typingTimerRef.current);
            typingTimerRef.current = null;
          }
        }
      }, speedMs);
    }

    // Cleanup when messages change or component unmounts
    return () => {
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [messages]);

  return (
    <aside className={`${isDark ? 'bg-gradient-to-br from-white/15 to-white/5 border-white/20' : 'bg-gradient-to-br from-white/70 to-white/40 border-gray-300/40'} backdrop-blur-2xl backdrop-saturate-150 w-full lg:w-[560px] xl:w-[640px] lg:sticky lg:top-4 lg:self-start h-[calc(100vh-160px)] min-h-[520px] rounded-2xl border p-4 flex flex-col shadow-lg ring-1 ${isDark ? 'ring-white/10' : 'ring-white/60'}`
      }>
        {/* Chat Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-white/20' : 'border-[#14A38F]/30'} ${isDark ? 'bg-white/10' : 'bg-white/60'} backdrop-blur-xl rounded-lg px-3 py-2`}>
          <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#14A38F]'}`}>
            Personal Teacher
          </h3>
          <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Ask me anything about the components
          </span>
        </div>

        {/* Messages List */}
        <div className={`flex-1 min-h-0 overflow-y-auto space-y-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}>
              <div
                className={`${
                  msg.role === "assistant"
                    ? isDark
                      ? "bg-white/10 backdrop-blur-xl text-white border border-white/20"
                      : "bg-[#14A38F] text-white border border-[#14A38F]"
                    : isDark
                    ? "bg-black/60 backdrop-blur-xl text-white border border-white/20"
                    : "bg-blue-600/70 backdrop-blur-xl text-white border border-blue-300/40"
                } max-w-[85%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-wrap break-words leading-relaxed text-[15px]`}
              >
                {msg.role === "assistant" && idx === typingIndex && typedContent.length > 0
                  ? typedContent
                  : msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="pt-4 border-t space-y-3">
          <div className={`flex items-center gap-2 ${isDark ? "bg-white/10 border-white/20" : "bg-white/60 border-gray-300/40"} backdrop-blur-xl rounded-xl border p-2 shadow-sm`}> 
            <button className={`p-2 rounded ${isDark ? "hover:bg-white/15" : "hover:bg-white"}`} aria-label="Attach file">
              <Paperclip className={`h-5 w-5 ${isDark ? "text-white/80" : "text-gray-700"}`} />
            </button>
            <button className={`p-2 rounded ${isDark ? "hover:bg-white/15" : "hover:bg-white"}`} aria-label="Voice input">
              <Mic className={`h-5 w-5 ${isDark ? "text-white/80" : "text-gray-700"}`} />
            </button>
            <input
              type="text"
              className={`flex-1 bg-transparent outline-none ${isDark ? "text-white placeholder-white/60" : "text-gray-900 placeholder-gray-600"}`}
              placeholder="Type your messages..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && text.trim()) {
                  onSend(text.trim());
                }
              }}
            />
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                isDark ? 'bg-white text-gray-900' : 'bg-[#14A38F] text-white'
              } disabled:opacity-50`}
              onClick={() => text.trim() && onSend(text.trim())}
              disabled={loading}
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </div>
        </div>
      </aside>
  );
};