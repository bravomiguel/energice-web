import { User } from '@prisma/client';
import H2 from './h2';

export default function WaiverTerms({
  firstName,
  lastName,
}: {
  firstName: User['firstName'];
  lastName: User['lastName'];
}) {
  return (
    <div className="flex-1 flex flex-col gap-5">
      <p className="font-semibold uppercase">Please read carefully before signing</p>
      <div className="flex flex-col gap-4">
        <p>
          {`This Cold Plunge Waiver and Release of Liability ("Waiver") is made and entered into as of ${new Date().toLocaleDateString(
            'en-US',
          )} by and between KoldUp and our partner gyms ("Provider"), and you, `}
          <span className="font-semibold underline">{`${firstName} ${lastName}`}</span>
          {`, the undersigned participant ("Participant").`}
        </p>
        <p className="font-semibold">
          {`In consideration of being permitted to participate in the cold plunge services offered by the Provider (the "Services"), Participant agrees as follows:`}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <H2>
          1. Risks and Responsibilities
        </H2>
        <p>
          Participant acknowledges that the Services involve inherent risks,
          including but not limited to:
        </p>
        <ul className="list-disc ml-5">
          <li>
            <p>
              <span className="font-semibold">Physical risks:</span> Cold shock,
              hypothermia, heart attack, stroke, muscle cramps, dizziness,
              fainting, and other potential health risks.
            </p>
          </li>
          <li>
            <p>
              <span className="font-semibold">Mental risks:</span> Anxiety,
              panic attacks, and claustrophobia.
            </p>
          </li>
        </ul>
        <p className="font-semibold">
          Participant represents and warrants that:
        </p>
        <ul className="list-disc ml-5">
          <li>Participant is at least 18 years old.</li>
          <li>
            Participant has consulted with a physician to ensure participation
            in the Services is safe for them, considering any pre-existing
            medical conditions.
          </li>
          <li>
            Participant understands the risks associated with the Services and
            voluntarily assumes all such risks.
          </li>
          <li>
            Participant is physically and mentally capable of safely
            participating in the Services.
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <H2>
          2. Waiver and Release of Liability
        </H2>
        <p className="font-semibold">{`Participant hereby waives, releases, and discharges Provider from any and all claims, demands, losses, liabilities, damages, and causes of action of any kind whatsoever (collectively, "Claims"), arising out of or related to Participant's participation in the Services, including, but not limited to, Claims arising from:`}</p>
        <ul className="list-disc ml-5">
          <li>{`Participant's own negligence or that of a third party.`}</li>
          <li>{`The negligence of the Provider.`}</li>
          <li>{`Participant's injury, illness, death, or property damage.`}</li>
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <H2>3. Indemnity</H2>
        <p>{`Participant agrees to indemnify and hold harmless the Provider from and against any and all Claims, losses, liabilities, damages, and costs (including reasonable attorneys' fees) arising out of or related to Participant's participation in the Services.`}</p>
      </div>
      <div className="flex flex-col gap-4">
        <H2>4. Medical Attention</H2>
        <p>{`Participant acknowledges that Provider is not a medical professional and cannot provide medical advice. Participant agrees to seek immediate medical attention in the event of any injury or illness arising from participation in the Services.`}</p>
      </div>
      <div className="flex flex-col gap-4">
        <H2>5. Governing Law</H2>
        <p>{`This Waiver shall be governed by and construed in accordance with the laws of the specific State in which the Participant usese the Services.`}</p>
      </div>
      <div className="flex flex-col gap-4">
        <H2>6. Entire Agreement</H2>
        <p>{`This Waiver constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior or contemporaneous communications, representations, or agreements, whether oral or written.`}</p>
      </div>
      <div className="flex flex-col gap-4">
        <H2>7. Severability</H2>
        <p>{`If any provision of this Waiver is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall remain in full force and effect.`}</p>
      </div>
      <div className="flex flex-col gap-4">
        <H2>8. Binding Effect</H2>
        <p>{`This Waiver shall be binding upon and inure to the benefit of the parties hereto and their respective heirs, successors, and assigns.`}</p>
      </div>
      <p className="font-semibold">{`Participant acknowledges that Participant has read this Waiver carefully and understands its terms. By selecting "I AGREE" below, Participant agrees to be bound by this Waiver and makes this agreement freely and voluntarily.`}</p>
    </div>
  );
}
