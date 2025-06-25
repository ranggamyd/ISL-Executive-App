import { Component, ReactNode } from "react";
import NotFound from "../pages/NotFound";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: unknown) {
        console.error("Caught by ErrorBoundary:", error);
    }

    render() {
        if (this.state.hasError) {
            return <NotFound />;
        }

        return this.props.children;
    }
}
