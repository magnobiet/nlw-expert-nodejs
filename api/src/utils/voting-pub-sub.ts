type Message = {
  pollOptionId: string;
  votes: number;
};

type Subscriber = (message: Message) => void;

class VotingPubSub {
  private channels: Record<string, Array<Subscriber>> = {};

  public subscribe(pollId: string, subscriber: Subscriber): void {
    if (!this.channels[pollId]) {
      this.channels[pollId] = [];
    }

    this.channels[pollId].push(subscriber);
  }

  public publish(pollId: string, message: Message): void {
    if (!this.channels[pollId]) {
      return;
    }

    for (const subscriber of this.channels[pollId]) {
      subscriber(message);
    }
  }
}

export const voting = new VotingPubSub();
